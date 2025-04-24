import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function parseCSVFile(filePath: string): Promise<Response[]> {
    const results: Response[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                fs.unlink(filePath, () => {}); // Clean up uploaded file
                resolve(results);
            })
            .on("error", (err) => reject(err));
    });
}
