import { useEffect, useReducer } from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";
import Skeleton from '@material-ui/lab/Skeleton';

import { Header } from "./Header";
import { getRestaurants } from "../apis/restaurants";
import MainCoverImage from '../images/main-cover-image.png';
import RestaurantImage from "../images/restaurant-image.jpg";

import {
  initialState,
  restaurantsActionTypes,
  restaurantsReducer,
} from '../reducers/restaurants';

import { REQUEST_STATE } from '../constants';

const MainCoverImageWrapper = styled.div`
  text-align: center;
`;

const MainCover = styled.img`
  height: 600px;
`;

const RestaurantsContentsList = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 150px;
`;

const RestaurantsContentWrapper = styled.div`
  width: 450px;
  height: 300px;
  padding: 48px;
`;

const RestaurantsImageNode = styled.img`
  width: 100%;
`;

const MainText = styled.p`
  color: black;
  font-size: 18px;
`;

const SubText = styled.p`
  color: black;
  font-size: 12px;
`;

export const Restaurants = () => {
  const [state, dispatch] = useReducer(restaurantsReducer, initialState);

  useEffect(() => {
    dispatch({ type: restaurantsActionTypes.FETCHING });
    getRestaurants()
    .then((data) =>
      dispatch({
        type: restaurantsActionTypes.FETCH_SUCCESS,
        payload: {
          restaurants: data.restaurants
        }
      })
    )
  }, [])

  return (
    <>
      <Header />
      <MainCoverImageWrapper>
        <MainCover src={MainCoverImage} alt="main cover" />
      </MainCoverImageWrapper>
      <RestaurantsContentsList>
        {state.fetchState === REQUEST_STATE.LOADING ?
          <>
            <Skeleton variant="rect" width={450} height={300} />
            <Skeleton variant="circle" width={450} height={300} />
            <Skeleton variant="rect" width={450} height={300} />
          </>
        :
          state.restaurantsList.map((item, index) =>
            <Link to={`/restaurants/${item.id}/foods`} key={index} style={{ textDecoration: 'none' }}>
              <RestaurantsContentWrapper>
                <RestaurantsImageNode src={RestaurantImage} />
                <MainText>{item.name}</MainText>
                <SubText>{`配送料：${item.fee}円 ${item.time_required}分`}</SubText>
              </RestaurantsContentWrapper>
            </Link>
          )
        }
      </RestaurantsContentsList>
    </>
  )
};