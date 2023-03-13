import {
  ALL_COORDINATES, DELETE_COORDINATES
} from "./actions";

const initialState = {
  myCoordinates: []
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ALL_COORDINATES:
      return {
        ...state,
        myCoordinates: [...state.myCoordinates, payload]
      }
      case DELETE_COORDINATES:
        return {
          ...state,
          myCoordinates: [],
        }
    default:
      return state;
  }
};
export default rootReducer;
