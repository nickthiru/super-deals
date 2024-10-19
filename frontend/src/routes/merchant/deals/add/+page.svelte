<h1 id="add-deal-title">Add a Deal</h1>

<form 
	method="POST"
	aria-labelledby="add-deal-title" 
	enctype="multipart/form-data"
	>
	
	<input type="hidden" name="merchantId" value="Nike">  This value is taken from when the merhant signs in and the http responses contains the merchantId (to be saved in a Svelte store)
	
	<label>
		Deal Title
		<input name="title" type="text">
	</label>

	<label>
		Original Price
		<input name="originalPrice" type="number">
	</label>

	<label>
		Discount
		<input name="discount" type="discount">
	</label>

  <label>
		Category
		<select name="category">
			<option value="">Select a category</option>
			<hr>
			<option value="foodDrink">Food & Drink</option>
			<option value="bathroom">Bathroom</option>
			<option value="jewelery">Jewelery</option>
			<option value="sports">Sports</option>
			<option value="tech">Technology</option>
			<option value="auto">Auto</option>
			<option value="entertainment">Entertainment</option>
			<option value="travel">Travel</option>
		</select>
	</label>

  <label>
		Logo
		<input name="logo" type="file" accept=".jpg, .png, .svg">
	</label>

	<label>
		Expiration
		<input name="expiration" type="date">
	</label>

  <button type="submit">Add Deal</button>
</form>


<style>
  label {
    display: block;
    margin-block: 10px;
  }

  button {
		margin-top: 10px;
	}
</style>
