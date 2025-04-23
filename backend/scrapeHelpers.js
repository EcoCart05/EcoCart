import axios from 'axios';
import cheerio from 'cheerio';

// Scraper for myecokart.com/shop
export async function scrapeMyEcoKart() {
  const url = 'https://myecokart.com/shop/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const products = [];
  $('.product').each((i, el) => {
    const name = $(el).find('.woocommerce-loop-product__title').text().trim();
    let image = $(el).find('img').attr('src');
    if (image && image.startsWith('//')) image = 'https:' + image;
    const price = $(el).find('.price').first().text().replace(/[^\d.]/g, '');
    const productUrl = $(el).find('a.woocommerce-LoopProduct-link').attr('href');
    if (name && image && price && productUrl) {
      // Detect organic/eco-friendly status
      const isOrganic = /organic/i.test(name);
      const certifications = [];
      if (isOrganic) certifications.push('Organic');
      products.push({
        id: 'myecokart_' + (i + 1),
        name,
        image,
        price: parseFloat(price),
        url: productUrl,
        source: 'myecokart.com',
        certifications
      });
    }
  });
  return products;
}

// Scraper for ecovians.com/collections/all-products
export async function scrapeEcovians() {
  const url = 'https://www.ecovians.com/collections/all-products/1716940000000025004';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const products = [];
  $('.product-card').each((i, el) => {
    const name = $(el).find('.product-card-title').text().trim();
    let image = $(el).find('img').attr('src');
    if (image && image.startsWith('//')) image = 'https:' + image;
    const price = $(el).find('.product-card-price').first().text().replace(/[^\d.]/g, '');
    const productUrl = $(el).find('a').attr('href');
    const fullUrl = productUrl && !productUrl.startsWith('http') ? 'https://www.ecovians.com' + productUrl : productUrl;
    if (name && image && price && fullUrl) {
      // Detect organic/eco-friendly status
      const isOrganic = /organic/i.test(name);
      const certifications = [];
      if (isOrganic) certifications.push('Organic');
      products.push({
        id: 'ecovians_' + (i + 1),
        name,
        image,
        price: parseFloat(price),
        url: fullUrl,
        source: 'ecovians.com',
        certifications
      });
    }
  });
  return products;
}
