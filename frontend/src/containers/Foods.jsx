import { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";

import styled from 'styled-components';
import Skeleton from '@material-ui/lab/Skeleton';

import { Header } from './Header';
import { FoodWrapper } from '../components/FoodWrapper';
import { FoodOrderDialog } from "../components/FoodOrderDialog";
import { NewOrderConfirmDialog } from '../components/NewOrderConfirmDialog';

import { foodsReducer, foodsTypes, initialState } from "../reducers/foods";

import { getFoods } from "../apis/foods";
import { postLineFoods, replaceLineFoods } from '../apis/line_foods';

import { REQUEST_STATE } from '../constants';
import { HTTP_STATUS_CODE } from '../constants';

import FoodImage from "../images/food-image.jpg"

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;

export const Foods = ( props ) => {
  const { match } = props;

  const [state, dispatch] = useReducer(foodsReducer, initialState)

  const history = useHistory();

  const initialModal = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingRestaurantName: '',
    newRestaurantName: '',
  }
  const [modal, setModal] = useState(initialModal);
  
  const submitOrder = () => {
    postLineFoods({
      foodId: modal.selectedFood.id,
      count: modal.selectedFoodCount,
    }).then(() => history.push('/orders'))
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setModal({
            ...modal,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingRestaurantName: e.response.data.existing_restaurant,
            newRestaurantName: e.response.data.new_restaurant,
          })
        } else {
          throw e;
        }
      })
  };

  const replaceOrder = () => {
    replaceLineFoods({
      foodId: modal.selectedFood.id,
      count: modal.selectedFoodCount,
    }).then(() => history.push('/orders'))
  };
  
  useEffect(() => {
    dispatch ({ type: foodsTypes.FETCHING })
    getFoods(match.params.restaurantsId)
    .then((data) => {
      dispatch ({
        type: foodsTypes.FETCH_SUCCESS,
        foodsList: data.foods
      })
    });
  }, []);
  
  return (
    <>
      <Header />
      <FoodsList>
        {state.fetchState === REQUEST_STATE.LOADING ? ( 
          <>
            {[...Array(12).keys()].map(i => (
              <ItemWrapper key={i}>
                <Skeleton key={i} variant="rect" width={450} height={180} />
              </ItemWrapper>
              ))
            }
          </>
          ) : (
            <>
              {state.foodsList.map((food) => (
                <ItemWrapper key={food.id}>
                 <FoodWrapper
                   food={food}
                   onClickFoodWrapper={(food) => setModal({...modal, isOpenOrderDialog: true, selectedFood: food })}
                   imageUrl={FoodImage}
                 />
                </ItemWrapper>
                ))
              }
            </>
          )
        }
      </FoodsList>
      {modal.isOpenOrderDialog &&
        <FoodOrderDialog
          isOpen={modal.isOpenOrderDialog}
          food={modal.selectedFood}
          countNumber={modal.selectedFoodCount}
          onClickCountUp={() => setModal({...modal, selectedFoodCount: modal.selectedFoodCount + 1})}
          onClickCountDown={() => setModal({...modal, selectedFoodCount: modal.selectedFoodCount - 1})}
          onClickOrder={() => submitOrder()}
          onClose={() => setModal({...modal, isOpenOrderDialog: false, selectedFood: null, selectedFoodCount: 1})}
        />
      }
      
      {modal.isOpenNewOrderDialog &&
        <NewOrderConfirmDialog
          isOpen={modal.isOpenNewOrderDialog}
          onClose={() => setModal({ ...modal, isOpenNewOrderDialog: false })}
          existingRestaurantName={modal.existingRestaurantName}
          newRestaurantName={modal.newRestaurantName}
          onClickSubmit={() => replaceOrder()}
        />
      }
    </>
  )
};

