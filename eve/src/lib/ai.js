/**
 * Hugging Face AI Image Verification
 * Uses Vision Transformer for civic content classification
 */

// Valid civic issue categories
const VALID_CATEGORIES = [
  'pothole', 'crack', 'damage', 'broken', 'waste', 'trash', 'graffiti',
  'streetlight', 'signal', 'sign', 'tree', 'sidewalk', 'road', 'infrastructure'
];

// Invalid/flagged content
const FLAGGED_LABELS = [
  'person', 'people', 'selfie', 'portrait', 'animal', 'vehicle', 'food',
  'indoor', 'screenshot', 'drawing', 'cartoon', 'text', 'document'
];

const AI_CONFIDENCE_THRESHOLD = 0.7;

/**
 * Verify image using Hugging Face Inference API
 * @param {string} imageUrl - URL of the uploaded image
 * @returns {Promise<{valid: boolean, category: string, confidence: number, label: string}>}
 */
export async function verifyImage(imageUrl) {
  try {
    const hfToken = process.env.HUGGINGFACE_TOKEN || process.env.HUGGINGFACE_API_TOKEN;

    if (!hfToken) {
      console.warn('⚠️ No HuggingFace token - running in bypass mode');
      return { valid: true, category: 'infrastructure', confidence: 1.0, label: 'bypass' };
    }

    // Use HuggingFace Router for Serverless Inference
    const modelId = "microsoft/resnet-50";
    const apiUrl = `https://router.huggingface.co/hf-inference/models/${modelId}`;

    console.log(`[AI] Verifying image via HF Router: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${hfToken.trim()}`,
        'Content-Type': 'application/json',
        'x-use-cache': 'true',
        'x-wait-for-model': 'true'
      },
      method: 'POST',
      body: JSON.stringify({ inputs: imageUrl })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AI] HF Router Error (${response.status}):`, errorText);
      throw new Error(`AI Service Unavailable: ${response.status}`);
    }

    const predictions = await response.json();

    if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
      console.error('[AI] Empty response from HF:', predictions);
      return { valid: false, category: null, confidence: 0, label: 'error' };
    }

    // Get top prediction - Handling both [[{label, score}]] and [{label, score}]
    const firstResult = Array.isArray(predictions[0]) ? predictions[0][0] : predictions[0];

    if (!firstResult) {
      return { valid: false, category: null, confidence: 0, label: 'error' };
    }

    const label = firstResult.label.toLowerCase();
    const confidence = firstResult.score;

    // Check if flagged
    const isFlagged = FLAGGED_LABELS.some(f => label.includes(f));

    // Check if valid civic category
    const isValid = !isFlagged && confidence >= AI_CONFIDENCE_THRESHOLD &&
      VALID_CATEGORIES.some(c => label.includes(c));

    // Map to category
    let category = 'other';
    if (label.includes('pothole') || label.includes('crack') || label.includes('road')) {
      category = 'road_damage';
    } else if (label.includes('waste') || label.includes('trash')) {
      category = 'waste';
    } else if (label.includes('graffiti')) {
      category = 'graffiti';
    } else if (label.includes('street') || label.includes('light')) {
      category = 'streetlight';
    } else if (label.includes('sidewalk') || label.includes('walk')) {
      category = 'sidewalk';
    }

    return {
      valid: isValid,
      category,
      confidence,
      label,
      flagged: isFlagged
    };

  } catch (error) {
    console.error('? AI Verification error:', error.message);
    // Fail open for better UX (allow through, admin can review)
    return { valid: true, category: 'unverified', confidence: 0, label: 'error', error: error.message };
  }
}

export { VALID_CATEGORIES, FLAGGED_LABELS, AI_CONFIDENCE_THRESHOLD };
