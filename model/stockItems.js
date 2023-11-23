class stockItems {
  constructor(itemCode, itemDescription, itemCategory, currentPrice) {
    this.itemCode = itemCode;
    this.itemDescription = itemDescription;
    this.itemCategory = itemCategory;
    this.currentPrice = currentPrice;
  }
}

module.exports = stockItems;
