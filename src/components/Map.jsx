import { useEffect, useState } from "react";
import { sampleData } from "../sampleData";
import PointModal from "./PointModal";
import { FaLocationDot } from "react-icons/fa6";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon as OlIcon } from "ol/style";
import ReactDOMServer from "react-dom/server";

const MapComponent = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointData, setPointData] = useState(sampleData.coordinates);

  useEffect(() => {
    const vectorSource = new VectorSource();

    const createIconStyle = (status) => {
      const color = status ? "green" : "red";
      const iconHTML = ReactDOMServer.renderToString(
        <FaLocationDot color={color} size={25} />
      );
      return new Style({
        image: new OlIcon({
          src: `data:image/svg+xml;utf8,${encodeURIComponent(iconHTML)}`,
          scale: 1,
          anchor: [0.5, 0.5],
        }),
      });
    };

    pointData.forEach((point) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.latitude, point.longitude])),
        pointData: point,
      });

      feature.setStyle(createIconStyle(point.status));

      vectorSource.addFeature(feature);
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
          wrapX: false,
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const extent = vectorSource.getExtent();
    map.getView().fit(extent, { padding: [50, 50, 50, 50] });

    map.on("click", (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const clickedPoint = feature.get("pointData");
        if (clickedPoint) {
          setSelectedPoint(clickedPoint);
          setIsModalOpen(true);
        }
      });
    });

    return () => {
      map.setTarget(null);
    };
  }, [pointData]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPoint(null);
  };

  const handleUpdatePoint = () => {
    const updatedData = pointData.map((point) =>
      point.latitude === selectedPoint.latitude &&
      point.longitude === selectedPoint.longitude
        ? selectedPoint
        : point
    );

    setPointData(updatedData);
    setIsModalOpen(false);
  };

  const handleStatusChange = () => {
    setSelectedPoint({
      ...selectedPoint,
      status: !selectedPoint.status,
    });
  };

  const handleCommentChange = (e) => {
    setSelectedPoint({
      ...selectedPoint,
      details: e.target.value,
    });
  };

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="w-full h-full"></div>

      {isModalOpen && selectedPoint && (
        <PointModal
          selectedPoint={selectedPoint}
          handleModalClose={handleModalClose}
          handleUpdatePoint={handleUpdatePoint}
          handleStatusChange={handleStatusChange}
          handleCommentChange={handleCommentChange}
        />
      )}
    </div>
  );
};

export default MapComponent;
