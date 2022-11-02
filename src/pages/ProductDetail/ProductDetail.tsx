import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../components/Config/Config';
import DetailSize from '../../components/detailSize/detailSize';
import './ProductDetail.scss';

const ProductDetail = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    fetch(`${API.products}/${params.id}`)
      .then(response => response.json())
      .then(data => setData(data.result));
  }, [params.id]);

  const { name, image_url, number, description, options } = data;

  const [minPrice, maxPrice] = [
    Number(data.id && data?.options.at(0)?.price).toLocaleString(),
    Number(data.id && data?.options.at(-1)?.price).toLocaleString(),
  ];

  const [selectedComponentNumber, setSelectedComponentNumber] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);
  const [sizeId, setSizeId] = useState('');

  const cartToken = localStorage.getItem('token');

  const cartFetch = () => {
    fetch(`${API.carts}`, {
      method: 'POST',
      headers: {
        Authorization: cartToken,
      },
      body: JSON.stringify({
        product_id: params.id,
        size_id: sizeId,
        quantity: totalNumber,
      }),
    })
      .then(response => response.json())
      .then(result => {
        cartSuccess(result);
      });
  };

  const cartSuccess = result => {
    if (result.message === 'SUCCESS') {
      alert('장바구니에 성공적으로 담겼습니다!');
      navigate('/cart');
    } else {
      alert('로그인 해 주세요!');
    }
  };

  if (description) {
    return (
      <div className="product-detail">
        <img src={`${image_url}`} className="left-section" alt="detail" />
        <div className="right-section">
          <div className="detail-header">
            <div className="product-title">{name}</div>
            <div className="product-price">
              <span className="min-price">{minPrice} 원</span>
              <span> - </span>
              <span className="max-price">{maxPrice} 원</span>
            </div>
            <div className="product-id">제품번호 {number}</div>
            <div className="product-description">{description}</div>
          </div>
          <div className="detail-main">
            <div className="size-title">사이즈</div>
            <hr></hr>
            {options.map((element, i) => {
              const { size, price, size_id } = element;
              return (
                <DetailSize
                  key={i}
                  index={i}
                  size={size}
                  price={price}
                  selectedComponentNumber={selectedComponentNumber}
                  setSelectedComponentNumber={setSelectedComponentNumber}
                  setTotalNumber={setTotalNumber}
                  setTotalPrice={setTotalPrice}
                  elementSizeId={size_id}
                  setSizeId={setSizeId}
                />
              );
            })}
            <hr></hr>
          </div>
          <div className="detail-footer">
            <button className="put-shopping-basket" onClick={cartFetch}>
              장바구니에 담기 ({totalPrice.toLocaleString()}원)
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductDetail;
