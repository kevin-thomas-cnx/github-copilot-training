import * as fs from 'fs';
import * as path from 'path';
import { HttpError } from '../utils/errors'; // Relative path to utils within lib

/**
 * Represents a location with geographical and optional airport information.
 */
export interface Location {
    id: string;
    name: string;
    type: string; // e.g., "City", "Airport"
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    airportCode?: string | null;
}

let loadedLocations: Location[] | null = null;
let loadError: HttpError | null = null;

/**
 * Loads location data from the JSON file.
 * Caches the data on first successful load.
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
        // 'src/data/locations.json' is expected at the root of your Next.js project.
        // process.cwd() in a Next.js API route refers to the project root.
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

        // Basic validation for location structure could be added here if needed

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
 * Service for managing and searching location data.
 */
export class LocationService {
    private locations: Location[];

    /**
     * Initializes a new instance of the LocationService class.
     * @throws Will throw an HttpError if the locations data cannot be loaded or parsed.
     */
    constructor() {
        // This will either return cached data or attempt to load,
        // throwing an error if loading failed (either now or on initial module load).
        this.locations = loadLocationsData();
    }

    /**
     * Searches for locations that match the given query string.
     * The search is case-insensitive and checks both name and airportCode.
     * @param query - The search query string.
     * @returns A Promise that resolves to an array of matching locations.
     * @throws Will throw an HttpError with status 400 if the query is invalid.
     * @throws Will throw an HttpError with status 500 if location data is unavailable.
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
