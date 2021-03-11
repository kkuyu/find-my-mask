import React from "react";

const Product = ({ match }) => {
  const { companyName, productName } = match.params;

  return (
    <div>
      Company: {companyName}
      <br />
      Product: {productName}
    </div>
  );
};

export default Product;
