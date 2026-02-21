import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const image = formData.get('image');
        const hfToken = process.env.HUGGINGFACE_API_TOKEN;

        // If no token or tiny token, return simulation data
        if (!hfToken || hfToken.length < 10) {
            console.log("[AI-API] No Hugging Face token or token too short. Returning simulation data.");
            return NextResponse.json({ label: 'Civic Issue (Simulation)', score: 0.9, isVerified: true });
        }

        const arrayBuffer = await image.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        // Use ConvNeXT - highly accurate and supported on the Router
        const modelId = "facebook/convnext-tiny-224";
        const apiUrl = `https://router.huggingface.co/hf-inference/models/${modelId}`;

        console.log(`[AI-API] Requesting verification (ConvNeXT Mode) from: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            headers: {
                "Authorization": `Bearer ${hfToken.trim()}`,
                "Content-Type": "application/json",
                "x-use-cache": "true",
                "x-wait-for-model": "true"
            },
            method: "POST",
            body: JSON.stringify({ inputs: base64Image }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[AI-API] Router Error (${response.status}):`, errorText);
            return NextResponse.json({ error: `AI Service Unavailable (${response.status})`, isDown: true });
        }

        const result = await response.json();

        // ACCURACY ENGINE: Keyword-based civic validation
        // We look for any urban/infrastructure/waste related terms in the results
        const civicKeywords = [
            'pothole', 'road', 'street', 'asphalt', 'pavement', 'manhole', 'sewer', 'crack', 'drain',
            'trash', 'garbage', 'waste', 'recycling', 'bin', 'ashcan', 'junk', 'plastic', 'bag', 'debris',
            'light', 'lamp', 'electric', 'pole', 'sign', 'traffic', 'hazard', 'broken', 'damaged',
            'park', 'fountain', 'bench', 'sidewalk', 'curb', 'infrastructure', 'concrete'
        ];

        if (Array.isArray(result) && result.length > 0) {
            // Check top 10 results for any civic match
            const top5 = result.slice(0, 10);
            const matches = top5.filter(r =>
                civicKeywords.some(key => r.label.toLowerCase().includes(key))
            );

            // If we have a keyword match, we trust it more than the raw top score
            const isVerified = matches.length > 0 || (top5[0].score > 0.4);
            const bestLabel = matches.length > 0 ? matches[0].label : top5[0].label;
            const bestScore = matches.length > 0 ? matches[0].score : top5[0].score;

            console.log(`[AI-API] Match Found: ${bestLabel} (${bestScore})`);

            return NextResponse.json({
                label: bestLabel,
                score: bestScore,
                isVerified: isVerified
            });
        }

        return NextResponse.json({ label: 'Unclassified', score: 0, isVerified: true });

    } catch (error) {
        console.error('AI ROUTE EXCEPTION:', error);
        return NextResponse.json({ error: "Connection error", isDown: true }, { status: 200 });
    }
}
