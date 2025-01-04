import React, { useState, useEffect } from 'react';

const Products = () => {
  // State để lưu trữ dữ liệu sản phẩm
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ API khi component được render
  useEffect(() => {
    // Fetch dữ liệu từ API backend
    fetch('https://web2-backend.vercel.app/api/products')
      .then((response) => response.json()) // Chuyển đổi phản hồi từ API sang dạng JSON
      .then((data) => {
        setProducts(data); // Cập nhật state với dữ liệu từ API
        setLoading(false); // Đặt trạng thái loading thành false sau khi lấy dữ liệu
      })
      .catch((error) => {
        console.error('Error:', error); // Nếu có lỗi, hiển thị lỗi trên console
        setLoading(false); // Đặt trạng thái loading thành false nếu có lỗi
      });
  }, []); // useEffect sẽ chỉ chạy một lần khi component được render

  // Nếu đang tải dữ liệu, hiển thị thông báo "Loading..."
  if (loading) {
    return <p>Loading...</p>;
  }

  // Hiển thị danh sách sản phẩm sau khi dữ liệu đã được tải
  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name}</li> // Giả sử mỗi sản phẩm có trường 'name'
        ))}
      </ul>
    </div>
  );
};

export default Products;
