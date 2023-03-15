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
import {
  allCoordinates,
  deleteCoordinates,
  allCircle,
  deleteCircles,
} from "./redux/actions";
import { lineString, lineOffset } from "@turf/turf";
import { Button } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

function App() {
  const dispatch = useDispatch();
  const [meters, setMeters] = useState(0);
  const [medida, setMedida] = useState(0);
  const [cambio, setCambio] = useState(false);
  const [activar, setActivar] = useState(false);
  const [newLine, setNewLine] = useState(false);
  const [onModal, setOnModal] = useState(false);
  const [onModal2, setOnModal2] = useState(false);
  const [color, setColor] = useState("RGBA( 70, 130, 180, 1 )");
  const [color2, setColor2] = useState("RGBA( 70, 130, 180, 1 )");
  const [tamaño, setTamaño] = useState(5);
  const [indMap, setIndMap] = useState(0);
  const [circle, setCircle] = useState(false);
  const [radio, setRadio] = useState(80);

  const allPoints = useSelector((state) => state.myCoordinates);
  const allCircles = useSelector((state) => state.myCircles);

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

  const stylesMap = [
    "mapbox://styles/mapbox/streets-v12",
    "mapbox://styles/mapbox/outdoors-v12",
    "mapbox://styles/mapbox/light-v11",
    "mapbox://styles/mapbox/dark-v11",
    "mapbox://styles/mapbox/satellite-v9",
    "mapbox://styles/mapbox/satellite-streets-v12",
  ];

  if (indMap === 6) {
    setIndMap(0);
  }

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
      setOnModal2(false);
    } else {
      setOnModal(false);
    }
  };

  const click2 = (event) => {
    event.preventDefault();
    let lng = event.lngLat.lng;
    let lat = event.lngLat.lat;
    let obj = {
      lng: lng,
      lat: lat,
    };
    // otro.push(obj)
    dispatch(allCircle(obj));
    setOnModal2(true);
    setOnModal(false);
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

  function resetLine() {
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

  function handleRadio(e) {
    setRadio(e.target.value);
  }

  function deleteAllCoordinates(e) {
    dispatch(deleteCoordinates());
    dispatch(deleteCircles());
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
    setMedida(0.3);
    setActivar(true);
  }
  function close() {
    setMedida(0);
    setActivar(false);
    setCambio(false);
    resetLine();
  }

  function changeMap() {
    setIndMap(indMap + 1);
  }

  function drawCircle() {
    if (circle === false) {
      setCircle(true);
    } else {
      setCircle(false);
    }
  }

  if(allCircles.length !==0){
    var num = allCircles.length-1
  }

  return (
    <div className="map">
      <Map
        initialViewState={{
          latitude: 4.6534649,
          longitude: -74.0836453,
          zoom: 12,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={stylesMap[indMap]}
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={circle === false ? (e) => click(e) : (e) => click2(e)}
        onTouchEnd={(e) => click(e)}
        onTouchMove={(e) => e}
      >
        <div className="positionMap">
          <button className="buttonMap" onClick={(e) => changeMap(e)}>
            <PublicIcon></PublicIcon>
          </button>
        </div>
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
                `${color}`,
                `${color}`,
              ],
              "line-width": tamaño,
            }}
          />
        </Source>

        {allCircles.map((elm, index) => {
          return (
            <Source
              id={`lines + ${index}`}
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: [[elm.lng, elm.lat], 0],
                },
              }}
            >
              <Layer
                id={`lines + ${index}`}
                type="circle"
                source="data"
                paint={{
                  "circle-color": `${color2}`,
                  "circle-radius": parseInt(radio),
                  "circle-opacity": 0.5,
                }}
              />
            </Source>
          );
        })}

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
                "line-color": `${color}`,
                "line-width": tamaño,
                "line-opacity": 0.5,
              }}
            />
          </Source>
        )}
        <GeolocateControl position="top-right" />
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />

        {circle === false ? (
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
                  "line-color": `${color}`,
                  "line-width": tamaño,
                  "line-opacity": 0.9,
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
        ) : (
          <div></div>
        )}

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
        <div className="delete2">
          <button className="button" onClick={(e) => drawCircle(e)}>
            {circle === false ? (
              <PanoramaFishEyeIcon sx={{ width: "18px" }}></PanoramaFishEyeIcon>
            ) : (
              <NotInterestedIcon sx={{ width: "18px" }}></NotInterestedIcon>
            )}
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
              <div className="inputTow">
                <h2>Modificar LineOffset</h2>
                <div className="inputOne">
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <label> Distancia </label>
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
                <h3>Color</h3>
                <form className="color">
                  <label>Rojo</label>
                  <input
                    onChange={(e) => setColor("RGBA( 220, 20, 60, 1 )")}
                    type="checkbox"
                    checked={color !== "RGBA( 220, 20, 60, 1 )" ? false : true}
                  />
                  <label>Verde</label>
                  <input
                    onChange={(e) => setColor("RGBA( 0, 128, 128, 1 )")}
                    type="checkbox"
                    checked={color !== "RGBA( 0, 128, 128, 1 )" ? false : true}
                  />
                  <label>Azul</label>
                  <input
                    onChange={(e) => setColor("RGBA( 70, 130, 180, 1 )")}
                    type="checkbox"
                    checked={color !== "RGBA( 70, 130, 180, 1 )" ? false : true}
                  />
                </form>
                <h3>Tamaño</h3>
                <form className="color">
                  <label>Peq</label>
                  <input
                    onChange={(e) => setTamaño(2)}
                    name="red"
                    type="checkbox"
                    checked={tamaño !== 2 ? false : true}
                  />
                  <label>Med</label>
                  <input
                    onChange={(e) => setTamaño(5)}
                    type="checkbox"
                    checked={tamaño !== 5 ? false : true}
                  />
                  <label>Gr</label>
                  <input
                    onChange={(e) => setTamaño(10)}
                    type="checkbox"
                    checked={tamaño !== 10 ? false : true}
                  />
                </form>
                <h3>Coordenadas</h3>
                <form onSubmit={(e) => handleOffSetLine(e)}>
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
              <button className="button3" onClick={() => resetLine()}>
                Restaurar OffsetLine
              </button>
            ) : (
              <div></div>
            )}
            <div className="information">
              <h2>Coordenas</h2>
              <h5> Punto 1</h5>
              <p>{`Lng: ${coordinates.lng1}`}</p>
              <p>{`Lat: ${coordinates.lat1}`}</p>
              <h5> Punto 2</h5>
              <p>{`Lng: ${coordinates.lng2}`}</p>
              <p>{`Lat: ${coordinates.lat2}`}</p>
              <h5> Punto 3</h5>
              <p>{`Lng: ${coordinates.lng3}`}</p>
              <p>{`Lat: ${coordinates.lat3}`}</p>
              <h5>
                {" "}
                <h4>Distancia:</h4>{" "}
                {`${Math.round(meters / 1000)} Km  - ${Math.round(
                  meters
                )} Mtr `}
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

      {onModal2 === true ? (
        <div className="info-box2">
          <div className="inputOne">
            <h2>Modificar Radio</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
              <label> Radio </label>
              <input
                type="number"
                placeholder="Radio"
                value={radio}
                name="radio"
                onChange={(e) => handleRadio(e)}
                className="typeOne"
              />
            </form>
            <h3>Color</h3>
            <form className="color">
              <label>Rojo</label>
              <input
                onChange={(e) => setColor2("RGBA( 220, 20, 60, 1 )")}
                type="checkbox"
                checked={color2 !== "RGBA( 220, 20, 60, 1 )" ? false : true}
              />
              <label>Verde</label>
              <input
                onChange={(e) => setColor2("RGBA( 0, 128, 128, 1 )")}
                type="checkbox"
                checked={color2 !== "RGBA( 0, 128, 128, 1 )" ? false : true}
              />
              <label>Azul</label>
              <input
                onChange={(e) => setColor2("RGBA( 70, 130, 180, 1 )")}
                type="checkbox"
                checked={color2 !== "RGBA( 70, 130, 180, 1 )" ? false : true}
              />
            </form>
            <div className="information">
              <h2>Coordenas</h2>
              <p>{`Lng: ${allCircles[num].lng}`}</p>
              <p>{`Lat: ${allCircles[num].lat}`}</p>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
