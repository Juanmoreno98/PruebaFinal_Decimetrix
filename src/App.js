import "./App.css";
import React, { useState, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import InsightsIcon from "@mui/icons-material/Insights";
import Map, {
  useControl,
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { allCoordinates, deleteCoordinates } from "./redux/actions";
import { lineString, lineOffset } from "@turf/turf";
import { Button } from "@mui/material";

function App() {
  const dispatch = useDispatch();
  const [meters, setMeters] = useState(0);
  const [medida, setMedida] = useState(0);
  const [cambio, setCambio] = useState(false);
  const [activar, setActivar] = useState(false);
  const [newLine, setNewLine] = useState(false);
  const [onModal, setOnModal] = useState(false);

  const allPoints = useSelector((state) => state.myCoordinates);

  const [coordinates, setCoordinates] = useState({
    lng1: null,
    lat1: null,
    lng2: null,
    lat2: null,
    lng3: null,
    lat3: null,
  });
  const [offsetCoordinates, setOffsetCoordinates] = useState({
    lng1: 0,
    lat1: 0,
    lng2: 0,
    lat2: 0,
    lng3: 0,
    lat3: 0,
  });

  function DrawControl(props) {
    useControl(() => new MapboxDraw(props), {
      position: props.position,
    });

    return null;
  }

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoianVhbm1vcmVubzk4IiwiYSI6ImNsZjJ1YnlicjBhOTczc280ZjhpMTFsbXcifQ.NFM1FlqVTC-rmYAOHtE4iw";

  const dataOne = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [offsetCoordinates.lng1, offsetCoordinates.lat1],
        [offsetCoordinates.lng2, offsetCoordinates.lat2],
        [offsetCoordinates.lng3, offsetCoordinates.lat3],
      ],
    },
  };

  var line = lineString(
    [
      [coordinates.lng1, coordinates.lat1],
      [coordinates.lng2, coordinates.lat2],
      [coordinates.lng3, coordinates.lat3],
    ],
    { stroke: "#F00" }
  );
  var offsetLine = lineOffset(line, medida, { units: "kilometers" });

  var res = [];

  const click = (event) => {
    event.preventDefault();
    let lng = event.lngLat.lng;
    let lat = event.lngLat.lat;
    res.push([lng, lat]);

    if (res.length === 3) {
      distance();
    }
    if (res.length === 3) {
      setCoordinates({
        lng1: res[0][0],
        lat1: res[0][1],
        lng2: res[1][0],
        lat2: res[1][1],
        lng3: res[2][0],
        lat3: res[2][1],
      });
      res = [];
      dispatch(allCoordinates(coordinates));
      setOnModal(true);
    } else {
      setOnModal(false);
    }
  };

  const distance = () => {
    let coordinates = new mapboxgl.LngLat(res[0][0], res[0][1]);
    let coordinates2 = new mapboxgl.LngLat(res[1][0], res[1][1]);
    let coordinates3 = new mapboxgl.LngLat(res[2][0], res[2][1]);
    let priemraDistacia = coordinates.distanceTo(coordinates2);
    let segundaDistacia = coordinates2.distanceTo(coordinates3);
    setMeters(priemraDistacia + segundaDistacia);
  };

  function handleOffSetLine(e) {
    e.preventDefault();
    setNewLine(true);
  }

  function hpVida() {
    setNewLine(false);
    setOffsetCoordinates({
      lng1: 0,
      lat1: 0,
      lng2: 0,
      lat2: 0,
      lng3: 0,
      lat3: 0,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleChange(e) {
    setMedida(e.target.value);
  }
  function handleChangeOffset(e) {
    setOffsetCoordinates({
      ...offsetCoordinates,
      [e.target.name]: e.target.value,
    });
    setCambio(true);
  }

  function deleteAllCoordinates(e) {
    dispatch(deleteCoordinates());
    setCoordinates({
      lng1: null,
      lat1: null,
      lng2: null,
      lat2: null,
      lng3: null,
      lat3: null,
    });
    setMedida(0);
    setNewLine(false);
    setOffsetCoordinates({
      lng1: 0,
      lat1: 0,
      lng2: 0,
      lat2: 0,
      lng3: 0,
      lat3: 0,
    });
    setOnModal(false);
    setMeters(0);
  }

  function open() {
    setMedida(2);
    setActivar(true);
  }
  function close() {
    setMedida(0);
    setActivar(false);
    setCambio(false);
    hpVida();
  }

  return (
    <div className="map">
      <Map
        initialViewState={{
          latitude: 4.6534649,
          longitude: -74.0836453,
          zoom: 10,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={(e) => click(e)}
        onTouchEnd={(e) => click(e)}
      >
        {allPoints.length !== 0 ? (
          allPoints.map((elm, indice) => {
            return (
              <Source
                id={`lines${indice}`}
                type="geojson"
                data={{
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      [elm.lng1, elm.lat1],
                      [elm.lng2, elm.lat2],
                      [elm.lng3, elm.lat3],
                    ],
                  },
                }}
              >
                <Layer
                  id={`lines${indice}`}
                  type="line"
                  source="data"
                  layout={{
                    "line-join": "round",
                    "line-cap": "round",
                  }}
                  paint={{
                    "line-color": [
                      "case",
                      ["boolean", ["feature-state", "hover"], false],
                      "rgba(9, 170, 0, 0.5)",
                      "rgba(9, 170, 238, 0.5)",
                    ],
                    "line-width": 5,
                  }}
                />
              </Source>
            );
          })
        ) : (
          <div> </div>
        )}

        <Source id="lineLayer" type="geojson" data={line}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "rgba(9, 170, 0, 0.5)",
                "rgba(9, 170, 238, 0.5)",
              ],
              "line-width": 5,
            }}
          />
        </Source>

        {newLine === true ? (
          <Source id="lineOffset" type="geojson" data={dataOne}>
            <Layer
              id="lineOffset"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "rgba(3, 0, 238, 0.5)",
                "line-width": 5,
              }}
            />
          </Source>
        ) : (
          <Source id="lineOffset" type="geojson" data={offsetLine}>
            <Layer
              id="lineOffset"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "rgba(3, 0, 238, 0.5)",
                "line-width": 5,
              }}
            />
          </Source>
        )}
        <GeolocateControl position="top-right" />
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
        <DrawControl
          position="top-right"
          displayControlsDefault={false}
          controls={{
            line_string: true,
          }}
          defaultMode="draw_line_string"
          styles={[
            {
              id: "gl-draw-line",
              type: "line",
              filter: [
                "all",
                ["==", "$type", "LineString"],
                ["!=", "mode", "static"],
              ],
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "rgba(9, 170, 238, 0.5)",
                "line-width": 8,
                "line-opacity": 0.6,
              },
            },
            {
              id: "gl-draw-polygon-and-line-vertex-halo-active",
              type: "circle",
              filter: [
                "all",
                ["==", "meta", "vertex"],
                ["==", "$type", "Point"],
                ["!=", "mode", "static"],
              ],
              paint: {
                "circle-radius": 12,
                "circle-color": "#FFF",
              },
            },
            {
              id: "gl-draw-polygon-and-line-vertex-active",
              type: "circle",
              filter: [
                "all",
                ["==", "meta", "vertex"],
                ["==", "$type", "Point"],
                ["!=", "mode", "static"],
              ],
              paint: {
                "circle-radius": 8,
                "circle-color": "#438EE4",
              },
            },
          ]}
        ></DrawControl>
        {onModal === false ? (
          <Button
            onClick={() => setOnModal(true)}
            variant="contained"
            className="info"
          >
            <InsightsIcon></InsightsIcon>
          </Button>
        ) : (
          <div></div>
        )}
        <div className="delete">
          <button className="button" onClick={(e) => deleteAllCoordinates(e)}>
            <DeleteIcon sx={{ width: "18px" }}></DeleteIcon>
          </button>
        </div>
      </Map>
      {onModal === true ? (
        <div>
          <div className="info-box">
            <div className="positionButtons">
              <button className="button1" onClick={() => open(2)}>
                Activar LineOffest
              </button>
              <button className="button2" onClick={() => close(0)}>
                Desactivar LineOffest
              </button>
            </div>
            {activar === true ? (
              <div className="inputOne">
                <form onSubmit={(e) => handleSubmit(e)}>
                  <label> Distancia LineOffset</label>
                  <input
                    type="number"
                    placeholder="Km"
                    value={medida}
                    name="medida"
                    onChange={(e) => handleChange(e)}
                    className="typeOne"
                  />
                </form>
              </div>
            ) : (
              <div></div>
            )}

            {activar === true ? (
              <div className="inputTow">
                <h3>Modificar LineOffset</h3>
                <form className="form" onSubmit={(e) => handleOffSetLine(e)}>
                  <label>Lng1</label>
                  <input
                    onChange={(e) => handleChangeOffset(e)}
                    name="lng1"
                    value={offsetCoordinates.lng1}
                    type="number"
                    className="inputsOffsetLine"
                  />
                  <label>Lat1</label>
                  <input
                    onChange={(e) => handleChangeOffset(e)}
                    name="lat1"
                    value={offsetCoordinates.lat1}
                    type="number"
                    className="inputsOffsetLine"
                  />
                  <label>Lng2</label>
                  <input
                    onChange={(e) => handleChangeOffset(e)}
                    name="lng2"
                    value={offsetCoordinates.lng2}
                    type="number"
                    className="inputsOffsetLine"
                  />
                  <label>Lat2</label>
                  <input
                    onChange={(e) => handleChangeOffset(e)}
                    name="lat2"
                    value={offsetCoordinates.lat2}
                    type="number"
                    className="inputsOffsetLine"
                  />
                  <label>Lng3</label>
                  <input
                    onChange={(e) => handleChangeOffset(e)}
                    name="lng3"
                    value={offsetCoordinates.lng3}
                    type="number"
                    className="inputsOffsetLine"
                  />
                  <label>Lat3</label>
                  <input
                    onChange={(e) => handleChangeOffset(e)}
                    name="lat3"
                    value={offsetCoordinates.lat3}
                    type="number"
                    className="inputsOffsetLine"
                  />
                  <button
                    className="buttonInput"
                    disabled={
                      offsetCoordinates.lat1 === 0 ||
                      offsetCoordinates.lat2 === 0 ||
                      offsetCoordinates.lat3 === 0 ||
                      offsetCoordinates.lng1 === 0 ||
                      offsetCoordinates.lng2 === 0 ||
                      offsetCoordinates.lng3 === 0
                        ? true
                        : false
                    }
                    type="submit"
                  >
                    {" "}
                    Aceptar
                  </button>
                </form>
              </div>
            ) : (
              <div></div>
            )}
            {cambio === true ? (
              <button className="button3" onClick={() => hpVida()}>
                Restaurar OffsetLine
              </button>
            ) : (
              <div></div>
            )}
            <div className="information">
              <h5>
                {" "}
                <h4>Existen aproximadamente:</h4>{" "}
                {`${Math.ceil(meters / 1000)} Km  - ${Math.ceil(
                  meters
                )} Mtr a lo largo de este tramo`}
              </h5>
            </div>
            <button className="buttonGoOut" onClick={(e) => setOnModal(false)}>
              <ClearIcon></ClearIcon>
            </button>
          </div>
        </div>
      ) : (
        <div className="noTengo"></div>
      )}
    </div>
  );
}

export default App;
