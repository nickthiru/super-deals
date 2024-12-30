<script>
  import { enhance } from '$app/forms';
  import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
  import KSUID from "ksuid";
  
  import generateTempCredentials from '$lib/utils';
  import backendOutputs from '../../../../backend/outputs.json';
  
  /** @type {import('./$types').PageData} */
  export let { accessToken } = data;

  /** @type {import('./$types').ActionData} */
  export let form;

  async function handleEnhance({ formData }) {
    // Get the file from the form data
    const file = formData.get('logo');
    
    if (file instanceof File) {
      // Get the Cognito Identity Pool ID from outputs.json
      const cognitoIdentityPoolId = backendOutputs.BackendStackdevAuthStackIdentityPoolStackDD35B90A.IdentityPoolId;

      // Get the S3 bucket name from outputs.json
      const s3BucketName = backendOutputs.BackendStackdevStorageStack55F9793E.S3BucketName;

      // Generate temporary credentials
      const credentials = await generateTempCredentials(accessToken, cognitoIdentityPoolId);

      // Initialize S3 client
      const s3Client = new S3Client({
        region: "us-east-1",
        credentials: credentials
      });

      // Generate a unique ID for the deal
      const dealId = KSUID.randomSync(new Date()).string;

      // Generate a unique key for the file
      const fileKey = `merchants/${userId}/deals/DEAL#${dealId}/logo/${file.name}`;

      try {
        console.log(`(+) Uploading logo to Bucket: ${s3BucketName}`);
        await s3Client.send(
          new PutObjectCommand({
            Bucket: s3BucketName,
            Key: fileKey,
            Body: file,
          })
        );

        // Replace the file in formData with the S3 key
        formData.set('logoFileKey', fileKey);

      } catch (error) {

        console.error("Error uploading file to S3", error);
        // Handle error (maybe set an error in formData)
      }
    }

    // You can add more processing here if needed

    return async ({ result, update }) => {
      // Handle the result of the form submission
      if (result.type === 'success') {
        // Maybe update some client-side state
      }
      // Always update the form to show any server-side errors
      await update();
    };
  }
</script>

<h1 id="add-deal-title">Add a Deal</h1>

<form method="POST" aria-labelledby="add-deal-title" enctype="multipart/form-data" use:enhance={handleEnhance}>
  <label>
    Deal Title
    <input name="title" type="text" required maxlength="255">
  </label>

  <label>
    Original Price
    <input name="originalPrice" type="number" required min="0">
  </label>

  <label>
    Discount
    <input name="discount" type="number" required min="0" max="100">
  </label>

  <label>
    Logo
    <input name="logo" type="file" required accept=".jpg, .jpeg, .png, .gif">
  </label>

  <label>
    Category
    <select name="category" required>
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
  </label>

  <label>
    Expiration
    <input name="expiration" type="date" required min="{new Date().toISOString().split('T')[0]}">
  </label>

  <button type="submit">Add Deal</button>
</form>

{#if form?.errors}
  <ul>
    {#each Object.entries(form.errors) as [field, errorMessages]}
      {#each errorMessages as errorMessage}
        <li class="error">{field}: {errorMessage}</li>
      {/each}
    {/each}
  </ul>
{/if}

<style>
  .error {
    color: tomato;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    display: block;
    margin-bottom: 1rem; /* Add some spacing between the fields */
  }

  input, select {
    margin-top: 0.5rem; /* Add some spacing between the label and the input */
  }

  button {
    display: inline-block;
    width: fit-content; /* Ensure the button fits its text content */
    margin-top: 0.5rem;
  }
</style>