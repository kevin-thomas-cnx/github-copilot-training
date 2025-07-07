import * as fs from 'fs';
import * as path from 'path';
import { HttpError } from '../utils/errors';

/**
 * Represents a geographic location, such as a city or airport.
 *
 * @remarks
 * Used for location search and weather forecast queries.
 *
 * @example
 * ```ts
 * const loc: Location = {
 *   id: '1',
 *   name: 'London',
 *   type: 'City',
 *   state: 'England',
 *   country: 'UK',
 *   latitude: 51.5074,
 *   longitude: -0.1278,
 *   airportCode: null
 * };
 * ```
 */
export interface Location {
    /** Unique identifier for the location. */
    id: string;
    /** Name of the location (e.g., city or airport name). */
    name: string;
    /** Type of location (e.g., "City", "Airport"). */
    type: string;
    /** State or region of the location. */
    state: string;
    /** Country of the location. */
    country: string;
    /** Latitude coordinate. */
    latitude: number;
    /** Longitude coordinate. */
    longitude: number;
    /** Optional airport code if applicable. */
    airportCode?: string | null;
}

let loadedLocations: Location[] | null = null;
let loadError: HttpError | null = null;


/**
 * Loads and caches the locations data from the local JSON file.
 *
 * @remarks
 * Throws an error if the file is missing, invalid, or cannot be parsed. Caches the result for future calls.
 *
 * @returns An array of {@link Location} objects.
 * @throws {HttpError} If the file is missing, invalid, or cannot be parsed.
 *
 * @example
 * ```ts
 * const locations = loadLocationsData();
 * ```
 */
export function loadLocationsData(): Location[] {
    // Return cached data if available
    if (loadedLocations) {
        return loadedLocations;
    }
    // If a previous load attempt failed, re-throw that specific error.
    if (loadError) {
        throw loadError;
    }

    try {
        const dataPath = path.join(process.cwd(), 'src', 'data', 'locations.json');

        if (!fs.existsSync(dataPath)) {
            const errMsg = `Locations data file not found at ${dataPath}. Please create it.`;
            console.error(errMsg);
            loadError = new HttpError(500, errMsg); // Cache the error
            throw loadError;
        }

        const rawData = fs.readFileSync(dataPath, 'utf8');
        const jsonData = JSON.parse(rawData);

        if (!Array.isArray(jsonData)) {
            const errMsg = "Invalid format: Locations data in locations.json is not an array.";
            console.error(errMsg);
            loadError = new HttpError(500, errMsg); // Cache the error
            throw loadError;
        }

        loadedLocations = jsonData as Location[]; // Store successfully loaded data
        return loadedLocations;

    } catch (error: any) {
        console.error("Failed to load or parse locations.json:", error.message);
        if (error instanceof SyntaxError) {
            loadError = new HttpError(500, `Failed to parse locations data (JSON syntax error): ${error.message}`);
        } else if (!loadError) { // If loadError wasn't set by fs.existsSync check
             loadError = new HttpError(500, `Failed to load locations data: ${error.message}`);
        }
        throw loadError; // Re-throw the caught or created HttpError
    }
}


/**
 * Service for searching and retrieving location data.
 *
 * @remarks
 * Loads location data from a local JSON file and provides search functionality.
 * Throws errors for missing data or invalid queries.
 *
 * @example
 * ```ts
 * const service = new LocationService();
 * const results = await service.searchLocations('London');
 * ```
 */
export class LocationService {
    /**
     * Cached array of locations loaded from file.
     */
    private locations: Location[];

    /**
     * Constructs a new LocationService and loads location data.
     * @throws {HttpError} If loading the data fails.
     */
    constructor() {
        // This will either return cached data or attempt to load,
        // throwing an error if loading failed (either now or on initial module load).
        this.locations = loadLocationsData();
    }

    /**
     * Searches for locations matching the provided query string.
     *
     * @param query - The search string to match against location name, state, country, or airport code.
     * @returns A promise resolving to an array of matching {@link Location} objects.
     * @throws {HttpError} 400 if the query is missing or invalid, 404 if no results, 500 for data errors.
     *
     * @example
     * ```ts
     * const service = new LocationService();
     * const results = await service.searchLocations('JFK');
     * ```
     */
    async searchLocations(query: string): Promise<Location[]> {
        if (!query || query.trim() === '') {
            throw new HttpError(400, 'Query parameter is missing or invalid.');
        }

        // Ensure locations are loaded (constructor should have handled this)
        // This check is more of a safeguard if the constructor logic changes or fails silently.
        if (!this.locations) {
             if (loadError) throw loadError; // Prefer the original loading error
             throw new HttpError(500, "Location data is not available.");
        }

        if (this.locations.length === 0 && !loadError) {
            // File was valid but empty
            console.warn("Location data file (data/locations.json) is empty. Search will return no results.");
            return [];
        }

        const q = query.trim().toLowerCase();
        const results = this.locations.filter(loc =>
            loc.name.toLowerCase().includes(q) ||
            (loc.state && loc.state.toLowerCase().includes(q)) ||
            (loc.country && loc.country.toLowerCase().includes(q)) ||
            (loc.airportCode && loc.airportCode.toLowerCase() === q) // exact match for airport code
        );
        if (results.length === 0) {
            throw new HttpError(404, 'No locations found for query');
        }
        return results;
    }
}
