import { HttpError } from '@/lib/utils/errors';

describe('LocationService and loadLocationsData', () => {
  // --- loadLocationsData tests ---
  const validLocations = [
    { id: '1', name: 'Test City', type: 'City', state: 'TS', country: 'Testland', latitude: 1, longitude: 2 },
  ];

  afterEach(() => {
    jest.resetModules();
  });

  it('loads and returns locations data', () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => true,
      readFileSync: () => JSON.stringify(validLocations),
    }));
    const { loadLocationsData } = require('@/lib/services/locationService');
    const result = loadLocationsData();
    expect(result).toEqual(validLocations);
  });

  it('throws HttpError if file does not exist', () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => false,
      readFileSync: () => ''
    }));
    const { loadLocationsData } = require('@/lib/services/locationService');
    expect(() => loadLocationsData()).toThrowError(/Locations data file not found/);
  });

  it('throws HttpError if data is not an array', () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => true,
      readFileSync: () => '{}'
    }));
    const { loadLocationsData } = require('@/lib/services/locationService');
    expect(() => loadLocationsData()).toThrowError(/not an array/);
  });

  it('throws HttpError if JSON is invalid (SyntaxError)', () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => true,
      readFileSync: () => '{ invalid json',
    }));
    const { loadLocationsData } = require('@/lib/services/locationService');
    expect(() => loadLocationsData()).toThrowError(/JSON syntax error/);
  });

  it('throws HttpError if fs.readFileSync throws a non-SyntaxError', () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => true,
      readFileSync: () => { throw new Error('Some fs error'); },
    }));
    const { loadLocationsData } = require('@/lib/services/locationService');
    expect(() => loadLocationsData()).toThrowError(/Failed to load locations data/);
  });

  it('returns cached locations if loadedLocations is set', () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => true,
      readFileSync: () => JSON.stringify([{ id: '1', name: 'A', type: 'City', state: 'S', country: 'C', latitude: 0, longitude: 0 }]),
    }));
    const mod = require('@/lib/services/locationService');
    // First call loads and caches
    mod.loadLocationsData();
    // Second call should return cached
    expect(mod.loadLocationsData()).toBe(mod.loadLocationsData());
  });

  it('throws cached loadError if set', () => {
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => false,
      readFileSync: () => ''
    }));
    const mod = require('@/lib/services/locationService');
    // First call sets loadError
    try { mod.loadLocationsData(); } catch (e) {}
    // Second call should throw cached error
    expect(() => mod.loadLocationsData()).toThrowError(/Locations data file not found/);
  });

  // --- LocationService (full coverage) tests ---
  const fullLocations = [
    { id: '1', name: 'Test City', type: 'City', state: 'TS', country: 'Testland', latitude: 1, longitude: 2, airportCode: 'TST' },
    { id: '2', name: 'Other City', type: 'City', state: 'OS', country: 'Otherland', latitude: 3, longitude: 4 },
  ];

  function mockLocationsData(data: any) {
    jest.doMock('fs', () => ({
      existsSync: () => true,
      readFileSync: () => JSON.stringify(data),
    }));
  }

  it('returns search results by name', async () => {
    mockLocationsData(fullLocations);
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    const results = await service.searchLocations('Test');
    expect(results[0].name).toBe('Test City');
  });

  it('returns search results by state', async () => {
    mockLocationsData(fullLocations);
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    const results = await service.searchLocations('TS');
    expect(results[0].state).toBe('TS');
  });

  it('returns search results by country', async () => {
    mockLocationsData(fullLocations);
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    const results = await service.searchLocations('Testland');
    expect(results[0].country).toBe('Testland');
  });

  it('returns search results by airportCode (exact match)', async () => {
    mockLocationsData(fullLocations);
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    const results = await service.searchLocations('TST');
    expect(results[0].airportCode).toBe('TST');
  });

  it('returns empty array and warns if locations file is empty', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockLocationsData([]);
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    const results = await service.searchLocations('anything');
    expect(results).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('empty'));
    warnSpy.mockRestore();
  });

  it('throws 400 if query is empty', async () => {
    mockLocationsData(fullLocations);
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    await expect(service.searchLocations('')).rejects.toThrow(/missing or invalid/);
  });

  it('throws 404 if no results found', async () => {
    mockLocationsData(fullLocations);
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    await expect(service.searchLocations('notfound')).rejects.toThrow(/No locations found/);
  });

  it('throws 500 if locations is not loaded', async () => {
    mockLocationsData(fullLocations);
    const { LocationService } = require('@/lib/services/locationService');
    const service = Object.create(LocationService.prototype);
    service.locations = undefined;
    await expect(service.searchLocations('Test')).rejects.toThrow(/not available/);
  });

  it('throws and propagates loadError from constructor', () => {
    jest.doMock('fs', () => ({
      existsSync: () => false,
      readFileSync: () => ''
    }));
    const { LocationService } = require('@/lib/services/locationService');
    expect(() => new LocationService()).toThrow(/Locations data file not found/);
  });

  it('returns multiple results if more than one location matches', async () => {
    const locations = [
      { id: '1', name: 'Alpha', type: 'City', state: 'A', country: 'X', latitude: 0, longitude: 0 },
      { id: '2', name: 'Alpha', type: 'City', state: 'B', country: 'Y', latitude: 1, longitude: 1 },
      { id: '3', name: 'Beta', type: 'City', state: 'C', country: 'Z', latitude: 2, longitude: 2 },
    ];
    jest.resetModules();
    jest.doMock('fs', () => ({
      existsSync: () => true,
      readFileSync: () => JSON.stringify(locations),
    }));
    const { LocationService } = require('@/lib/services/locationService');
    const service = new LocationService();
    const results = await service.searchLocations('Alpha');
    expect(results.length).toBe(2);
    expect(results[0].name).toBe('Alpha');
    expect(results[1].name).toBe('Alpha');
  });
});
