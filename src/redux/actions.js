export const ALL_COORDINATES = "ALL_COORDINATES"
export const DELETE_COORDINATES = "DELETE_COORDINATES"


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
