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
    const hfToken = process.env.HUGGINGFACE_TOKEN;
    
    if (!hfToken) {
      console.warn('?? No HuggingFace token - running in bypass mode');
      return { valid: true, category: 'infrastructure', confidence: 1.0, label: 'bypass' };
    }

    // Use HuggingFace Inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ inputs: imageUrl })
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const predictions = await response.json();
    
    if (!predictions || !predictions[0]) {
      return { valid: false, category: null, confidence: 0, label: 'error' };
    }

    // Get top prediction
    const top = predictions[0][0];
    const label = top.label.toLowerCase();
    const confidence = top.score;

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
