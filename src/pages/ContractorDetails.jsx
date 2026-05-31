import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ContractorDetails = ({ language }) => {
  const [roads, setRoads] = useState([]);

  useEffect(() => {
    fetchRoadData();
  }, []);

  const fetchRoadData = async () => {
    const querySnapshot = await getDocs(collection(db, "road_metadata"));

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRoads(data);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "45px",
          marginBottom: "30px",
          textAlign: "center",
          color: "#7fffd4",
        }}
      >
        {language === "hi"
          ? "ठेकेदार विवरण"
          : "Contractor Details"}
      </h1>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        {roads.map((road) => (
          <div
            key={road.id}
            style={{
              background: "#111c44",
              padding: "25px",
              borderRadius: "20px",
              border: "1px solid #2d4fff",
            }}
          >
            <h2 style={{ color: "#7fffd4" }}>
              {language === "hi"
                ? road.contractorNameHindi
                : road.contractorName}
            </h2>

            <p>
              <strong>
                {language === "hi"
                  ? "सड़क प्रकार: "
                  : "Road Type: "}
              </strong>

              {language === "hi"
                ? road.roadTypeHindi
                : road.roadType}
            </p>

            <p>
              <strong>
                {language === "hi"
                  ? "जिम्मेदार प्राधिकरण: "
                  : "Authority: "}
              </strong>

              {language === "hi"
                ? road.authorityHindi
                : road.authority}
            </p>

            <p>
              <strong>
                {language === "hi"
                  ? "अंतिम मरम्मत तिथि: "
                  : "Last Repair Date: "}
              </strong>

              {road.lastRepairDate}
            </p>

            <p>
              <strong>
                {language === "hi"
                  ? "बजट: "
                  : "Budget: "}
              </strong>

              {road.budget}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractorDetails;