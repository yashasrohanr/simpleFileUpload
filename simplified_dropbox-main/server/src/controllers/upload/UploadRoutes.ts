import { Request, Response as ExResponse, Router } from "express";
import multer from "multer";
import path from "path";
import { parseCSVFile } from "../../utils/csvparser";
import Response from "../../utils/Response";

const upload = multer({ dest: "uploads/" });

class UploadRoutes {
    public router: Router;

    constructor() {
        console.log("Mounting: UploadRoutes");
        this.router = Router();
        this.initialize();
    }

    private initialize() {
        this.router.post(
            "/api/upload",
            upload.single("file"),
            async (req: Request, res: ExResponse): Promise<void> => {
                try {
                    console.log("Upload route hit", req.method, req.path);
                    if (!req.file) {
                        return Response.badRequest(res, "CSV file is required");
                    }

                    const filePath = path.join(
                        __dirname,
                        "../../../uploads",
                        req.file.filename
                    );

                    const results = await parseCSVFile(filePath);
                    const analysis = this.analyzeCSV(results);

                    return Response.ok(res, {
                        message: "File processed and analyzed successfully",
                        analysis,
                        sample: results.slice(0, 5),
                    });
                } catch (err: any) {
                    return Response.serverError(
                        res,
                        err.message || "Something went wrong"
                    );
                }
            }
        );
    }

    private analyzeCSV(data: any[]) {
        const genreCount: Record<string, number> = {};
        let totalRating = 0;
        let ratingCount = 0;

        for (const row of data) {
            const genre = row.genre?.trim();
            const rating = parseFloat(row.rating);

            if (genre) {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
            }

            if (!isNaN(rating)) {
                totalRating += rating;
                ratingCount++;
            }
        }

        const averageRating = ratingCount
            ? (totalRating / ratingCount).toFixed(2)
            : "N/A";

        return {
            totalRows: data.length,
            genreCount,
            averageRating,
        };
    }
}

export default UploadRoutes;
