const productModel = require("../model/productModel");

class Features {
  constructor(mongooseQuery, stringQuery) {
    this.mongooseQuery = mongooseQuery;
    this.stringQuery = stringQuery;
  }

  Filter() {
    let queryFilter = { ...this.stringQuery };
    const queryexcl = ["page", "limit", "field", "sort"];
    queryexcl.forEach((field) => delete queryFilter[field]);

    queryFilter = JSON.stringify(queryFilter).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryFilter = JSON.parse(queryFilter);

    this.mongooseQuery = this.mongooseQuery.find(queryFilter);
    return this;
  }

  sort() {
    if (this.stringQuery.sort) {
      let sortby = this.stringQuery.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortby);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  field() {
    if (this.stringQuery.field) {
      let fieldby = this.stringQuery.field.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fieldby);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.stringQuery.keyword) {
      let query = {};

      query.$or = [
        { title: { $regex: this.stringQuery.keyword, $options: "i" } },
        { description: { $regex: this.stringQuery.keyword, $options: "i" } },
      ];

      this.mongooseQuery = productModel.find(query);
    }
    return this;
  }

  pagination(countDoc) {
    const page = +this.stringQuery.page || 1;
    const limit = +this.stringQuery.limit || 10;
    const skip = (page - 1) * limit;
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    console.log(countDoc);
    console.log(skip + limit);

    pagination.NumberOfPage = Math.ceil(+countDoc / +limit);
    if (skip + limit < countDoc) {
      pagination.next = +page + 1;
    }
    if (skip > 1) {
      pagination.prev = +page - 1;
    }
    this.paginationResult = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    // express middleware  .populate({ path: "category", select: "name-_id" });
    return this;
  }
}
module.exports = Features;
