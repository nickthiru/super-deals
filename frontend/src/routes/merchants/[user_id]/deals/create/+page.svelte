<script>
  import { enhance } from '$app/forms';
  import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
  import backendOutputs from '$backend-outputs';
  
  /** @type {any} */
  export let data;

  /** @type {any} */
  export let form;

  /**
   * @typedef {Object} DealFormData
   * @property {string} title - The title of the deal
   * @property {number} originalPrice - The original price
   * @property {number} discount - The discount percentage
   * @property {File} logo - The deal logo file
   * @property {string} category - The deal category
   * @property {string} expiration - The expiration date
   */

  /** @type {boolean} */
  let isUploading = false;
  /** @type {string|null} */
  let uploadError = null;

  const { 
    userId, 
    credentials,
    dealId,
    s3BucketName
  } = data;

  /**
   * Validates the file before upload
   * @param {File} file - The file to validate
   * @returns {string|null} Error message if validation fails, null otherwise
   */
  function validateFile(file) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload a JPG, PNG, or GIF.';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size too large. Maximum size is 5MB.';
    }

    return null;
  }

  /**
   * Handles the form enhancement for file upload
   * @param {{ formData: FormData }} param0 - The form data
   * @returns {Promise<(options: { result: { type: string }, update: () => Promise<void> }) => Promise<void>>} Form enhancement handler
   */
  async function handleEnhance({ formData }) {
    const file = formData.get('logo');
    uploadError = null;
    isUploading = false;

    if (!(file instanceof File)) {
      uploadError = 'Please select a file to upload';
      return;
    }

    // Validate file
    const fileError = validateFile(file);
    if (fileError) {
      uploadError = fileError;
      return;
    }

    // Generate a unique key for the file
    const fileKey = `merchants/${userId}/deals/DEAL-${dealId}/logo/${file.name}`;
    
    if (credentials) {
      isUploading = true;
      try {
        // Create S3 client with credentials from Amplify
        const s3Client = new S3Client({
          region: 'us-east-1',
          credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.sessionToken
          }
        });

        await s3Client.send(new PutObjectCommand({
          Bucket: s3BucketName,
          Key: fileKey,
          Body: file,
          ContentType: file.type // Set proper content type for browser rendering
        }));

        // Update form data
        formData.delete('logo');
        formData.set('logoFileKey', fileKey);
        formData.set('dealId', dealId);

      } catch (error) {
        console.error("Error uploading file to S3:", error);
        uploadError = 'Failed to upload image. Please try again.';
        return;
      } finally {
        isUploading = false;
      }
    }

    return async ({ result, update }) => {
      if (result.type === 'success') {
        // Clear any existing errors
        uploadError = null;
      }
      await update();
    };
  }
</script>

<h1 id="add-deal-title">Add a Deal</h1>

<form 
  method="POST" 
  aria-labelledby="add-deal-title" 
  enctype="multipart/form-data" 
  use:enhance={handleEnhance}
  class="deal-form"
>
  <div class="form-group">
    <label for="title">Deal Title</label>
    <input 
      id="title"
      name="title" 
      type="text" 
      required 
      maxlength="255"
      class="form-input"
      aria-invalid={form?.errors?.title ? true : undefined}
    >
  </div>

  <div class="form-group">
    <label for="originalPrice">Original Price</label>
    <input 
      id="originalPrice"
      name="originalPrice" 
      type="number" 
      required 
      min="0"
      step="0.01"
      class="form-input"
      aria-invalid={form?.errors?.originalPrice ? true : undefined}
    >
  </div>

  <div class="form-group">
    <label for="discount">Discount (%)</label>
    <input 
      id="discount"
      name="discount" 
      type="number" 
      required 
      min="0" 
      max="100"
      class="form-input"
      aria-invalid={form?.errors?.discount ? true : undefined}
    >
  </div>

  <div class="form-group">
    <label for="logo">Logo</label>
    <input 
      id="logo"
      name="logo" 
      type="file" 
      required 
      accept=".jpg,.jpeg,.png,.gif"
      class="form-input"
      aria-invalid={uploadError || form?.errors?.logo ? true : undefined}
    >
    {#if uploadError}
      <span class="error-message">{uploadError}</span>
    {/if}
  </div>

  <div class="form-group">
    <label for="category">Category</label>
    <select 
      id="category"
      name="category" 
      required
      class="form-input"
      aria-invalid={form?.errors?.category ? true : undefined}
    >
      <option value="">Select a category</option>
      <option value="foodDrink">Food & Drink</option>
      <option value="bathroom">Bathroom</option>
      <option value="jewelery">Jewelery</option>
      <option value="sports">Sports</option>
      <option value="tech">Tech</option>
      <option value="auto">Auto</option>
      <option value="entertainment">Entertainment</option>
      <option value="travel">Travel</option>
    </select>
  </div>

  <div class="form-group">
    <label for="expiration">Expiration Date</label>
    <input 
      id="expiration"
      name="expiration" 
      type="date" 
      required 
      min={new Date().toISOString().split('T')[0]}
      class="form-input"
      aria-invalid={form?.errors?.expiration ? true : undefined}
    >
  </div>

  <button type="submit" class="submit-button" disabled={isUploading}>
    {#if isUploading}
      Uploading...
    {:else}
      Add Deal
    {/if}
  </button>
</form>

{#if form?.errors}
  <ul class="error-list" role="alert">
    {#each Object.entries(form.errors) as [field, errorMessages]}
      {#each errorMessages as errorMessage}
        <li class="error">{field}: {errorMessage}</li>
      {/each}
    {/each}
  </ul>
{/if}

<style>
  .deal-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .form-input[aria-invalid="true"] {
    border-color: tomato;
  }

  .submit-button {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    align-self: flex-start;
  }

  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #45a049;
  }

  .error-list {
    list-style: none;
    padding: 1rem;
    margin-top: 1rem;
    background-color: #fff5f5;
    border: 1px solid tomato;
    border-radius: 4px;
  }

  .error {
    color: tomato;
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: tomato;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
</style>