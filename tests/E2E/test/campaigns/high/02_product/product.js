const {Menu} = require('../../../selectors/BO/menu.js');
let promise = Promise.resolve();

module.exports = {
  createProduct: function (AddProductPage, productData) {
    scenario('Create a new product in the Back Office', client => {
      test('should go to "Product Settings" page', () => client.waitForExistAndClick(Menu.Sell.Catalog.catalog_menu));
      test('should click on "New Product" button', () => client.waitForExistAndClick(AddProductPage.new_product_button));
      test('should set the "Name" input', () => client.waitAndSetValue(AddProductPage.product_name_input, productData["name"] + date_time));
      test('should set the "Reference"', () => client.waitAndSetValue(AddProductPage.product_reference, productData["reference"]));
      test('should set the "Quantity" input', () => client.waitAndSetValue(AddProductPage.quantity_shortcut_input, productData["quantity"]));
      test('should set the "Price" input', () => client.setPrice(AddProductPage.priceTE_shortcut, productData["price"]));
      test('should upload the first product picture', () => client.uploadPicture(productData["image_name"], AddProductPage.picture));

      if (productData.hasOwnProperty('type')) {
        scenario('Add the created product to pack', client => {
          test('should select the "Pack of products"', () => client.waitAndSelectByValue(AddProductPage.product_type, 1));
          test('should add products to the pack', () => client.addPackProduct(productData['product']['name'] + date_time, productData['product']['quantity']));
        }, 'product/product');
      }

      if (productData.hasOwnProperty('attribute')) {
        scenario('Add Attribute', client => {
          test('should select the "Product with combination" radio button', () => client.scrollWaitForExistAndClick(AddProductPage.variations_type_button));
          test('should go to "Combinations" tab', () => client.scrollWaitForExistAndClick(AddProductPage.variations_tab));
          test('should select the variation', () => {
            return promise
              .then(() => client.waitAndSetValue(AddProductPage.variations_input, productData['attribute']['name'] + date_time + " : All"))
              .then(() => client.waitForExistAndClick(AddProductPage.variations_select));
          });
          test('should click on "Generate" button', () => client.waitForExistAndClick(AddProductPage.variations_generate));
          test('should verify the appearance of the green validation', () => client.checkTextValue(AddProductPage.validation_msg, 'Settings updated.'));
          test('should select all the generated variations', () => client.waitForVisibleAndClick(AddProductPage.var_selected));
          test('should set the "Variations quantity" input', () => client.setVariationsQuantity(AddProductPage, productData['attribute']['variation_quantity']));
        }, 'product/product');
      }

      if (productData.hasOwnProperty('feature')) {
        scenario('Add Feature', client => {
          test('should click on "Add feature" button', () => {
            return promise
              .then(() => client.scrollTo(AddProductPage.product_create_category_btn))
              .then(() => client.waitForExistAndClick(AddProductPage.add_feature_to_product_button));
          });
          test('should select the created feature', () => client.selectFeature(AddProductPage, productData['feature']['name'] + date_time, productData['feature']['value']));
        }, 'product/product');
      }

      scenario('Save the created product', client => {
        test('should switch the product online', () => client.waitForExistAndClick(AddProductPage.product_online_toggle));
        test('should click on "Save" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
        test('should verify the appearance of the green validation', () => client.checkTextValue(AddProductPage.validation_msg, 'Settings updated.'));
      }, 'product/product');

    }, 'product/product');

  },
  
  checkProductBO(AddProductPage, productData) {
    scenario('Check the product creation in the Back Office', client => {
      test('should go to "Catalog"', () => client.goToCatalog());
      test('should search for product by name', () => client.searchProductByName(productData.name + date_time));
      test('should check the existence of product name', () => client.checkTextValue(AddProductPage.catalog_product_name, productData.name + date_time));
      test('should check the existence of product reference', () => client.checkTextValue(AddProductPage.catalog_product_reference, productData.reference));
      test('should check the existence of product category', () => client.checkTextValue(AddProductPage.catalog_product_category, 'Home'));
      test('should check the existence of product price TE', () => client.checkProductPriceTE(productData.price));
      test('should check the existence of product quantity', () => client.checkTextValue(AddProductPage.catalog_product_quantity, productData.quantity));
      test('should check the existence of product status', () => client.checkTextValue(AddProductPage.catalog_product_online, 'check'));
      test('should reset filter', () => client.waitForExistAndClick(AddProductPage.catalog_reset_filter));
    }, 'product/check_product');
  }
};
