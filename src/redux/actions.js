export const ALL_COORDINATES = "ALL_COORDINATES";
export const DELETE_COORDINATES = "DELETE_COORDINATES";
export const CIRCLE = "CIRCLE";
export const DELETE_CIRCLE = "DELETE_CIRCLE";




export function allCircle(data) {
  return{
    type: CIRCLE,
    payload: data
}
}


export function allCoordinates (data) {
  return{
    type: ALL_COORDINATES,
    payload: data
}
}


export function deleteCoordinates () {
  return{
    type: DELETE_COORDINATES,
}
}

export function deleteCircles () {
  return{
    type: DELETE_CIRCLE,
}
}

