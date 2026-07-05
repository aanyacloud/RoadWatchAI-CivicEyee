import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ContractorDetails = () => {
  const [roads, setRoads] = useState([]);

  const language =
    localStorage.getItem("language") || "en";

  useEffect(() => {
    fetchRoadData();
  }, []);

  const fetchRoadData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "road_metadata")
      );

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRoads(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-slate-500";

    if (
      status.toLowerCase().includes("complete")
    )
      return "bg-green-500";

    if (
      status.toLowerCase().includes("progress")
    )
      return "bg-yellow-500 text-black";

    return "bg-orange-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* HEADER */}
      <div className="text-center mb-10">

        <h1 className="text-5xl font-bold text-cyan-400 mb-4">
          {language === "hi"
            ? "ठेकेदार एवं बजट विवरण"
            : "Contractor & Budget Details"}
        </h1>

        <p className="text-slate-400 text-lg">
          {language === "hi"
            ? "सड़क परियोजनाओं, बजट और रखरखाव की पारदर्शिता जानकारी"
            : "Transparency information for road projects, budgets and maintenance"}
        </p>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h3 className="text-slate-400 mb-2">
            {language === "hi"
              ? "कुल परियोजनाएँ"
              : "Total Projects"}
          </h3>

          <p className="text-4xl font-bold text-cyan-400">
            {roads.length}
          </p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h3 className="text-slate-400 mb-2">
            {language === "hi"
              ? "सक्रिय परियोजनाएँ"
              : "Active Projects"}
          </h3>

          <p className="text-4xl font-bold text-yellow-400">
            {
              roads.filter(
                (r) =>
                  r.status &&
                  r.status
                    .toLowerCase()
                    .includes("progress")
              ).length
            }
          </p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h3 className="text-slate-400 mb-2">
            {language === "hi"
              ? "पूर्ण परियोजनाएँ"
              : "Completed Projects"}
          </h3>

          <p className="text-4xl font-bold text-green-400">
            {
              roads.filter(
                (r) =>
                  r.status &&
                  r.status
                    .toLowerCase()
                    .includes("complete")
              ).length
            }
          </p>
        </div>

      </div>

      {/* EMPTY */}
      {roads.length === 0 && (
        <div className="text-center text-slate-400 text-xl">
          {language === "hi"
            ? "कोई डेटा उपलब्ध नहीं है"
            : "No contractor data available"}
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {roads.map((road) => (

          <div
            key={road.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500 transition"
          >

            {/* TITLE */}
            <div className="flex justify-between items-start mb-6">

              <h2 className="text-3xl font-bold text-cyan-400">
                {language === "hi"
                  ? road.contractorNameHindi
                  : road.contractorName}
              </h2>

              <span
                className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                  road.status
                )}`}
              >
                {language === "hi"
                  ? road.statusHindi
                  : road.status}
              </span>

            </div>

            {/* ROAD TYPE */}
            <p className="mb-3">
              <strong>
                {language === "hi"
                  ? "सड़क प्रकार: "
                  : "Road Type: "}
              </strong>

              {language === "hi"
                ? road.roadTypeHindi
                : road.roadType}
            </p>

            {/* AUTHORITY */}
            <p className="mb-3">
              <strong>
                {language === "hi"
                  ? "जिम्मेदार प्राधिकरण: "
                  : "Authority: "}
              </strong>

              {language === "hi"
                ? road.authorityHindi
                : road.authority}
            </p>

            {/* LAST REPAIR */}
            <p className="mb-3">
              <strong>
                {language === "hi"
                  ? "अंतिम मरम्मत तिथि: "
                  : "Last Repair Date: "}
              </strong>

              {road.lastRepairDate}
            </p>

            {/* BUDGET BOX */}
            <div className="grid grid-cols-2 gap-4 mt-5">

              <div className="bg-slate-800 rounded-2xl p-4">
                <p className="text-slate-400 text-sm">
                  {language === "hi"
                    ? "स्वीकृत बजट"
                    : "Sanctioned"}
                </p>

                <p className="font-bold text-green-400 text-lg">
                  {road.sanctionedBudget ||
                    road.budget}
                </p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-4">
                <p className="text-slate-400 text-sm">
                  {language === "hi"
                    ? "व्ययित बजट"
                    : "Spent"}
                </p>

                <p className="mt-4">
  <strong>
    {language === "hi"
      ? "कार्यपालन अभियंता: "
      : "Executive Engineer: "}
  </strong>

  {language === "hi"
    ? road.engineerNameHindi
    : road.engineerName}
</p>

<p className="mt-2">
  <strong>
    {language === "hi"
      ? "संपर्क: "
      : "Contact: "}
  </strong>

  {road.engineerPhone}
</p>

<p className="mt-2">
  <strong>
    {language === "hi"
      ? "सड़क लंबाई: "
      : "Road Length: "}
  </strong>

  {language === "hi"
    ? road.roadLengthHindi
    : road.roadLength}
</p>

<p className="mt-2">
  <strong>
    {language === "hi"
      ? "निधि स्रोत: "
      : "Fund Source: "}
  </strong>

  {language === "hi"
    ? road.fundSourceHindi
    : road.fundSource}
</p>

<p className="mt-2">
  <strong>
    {language === "hi"
      ? "अंतिम निरीक्षण: "
      : "Last Inspection: "}
  </strong>

  {road.lastInspectionDate}
</p> 

                <p className="font-bold text-yellow-400 text-lg">
                  {road.spentBudget || "N/A"}
                </p>
              </div>

            </div>
            {/* BUDGET UTILIZATION */}

{road.sanctionedBudget &&
 road.spentBudget && (() => {

  const sanctioned = Number(
    (road.sanctionedBudget || "")
      .replace(/[^0-9]/g, "")
  );

  const spent = Number(
    (road.spentBudget || "")
      .replace(/[^0-9]/g, "")
  );

  const utilization =
    sanctioned > 0
      ? Math.round((spent / sanctioned) * 100)
      : 0;

  return (

    <div className="mt-6">

      <div className="flex justify-between mb-2">

        <span className="text-slate-300">
          {language === "hi"
            ? "बजट उपयोग"
            : "Budget Utilization"}
        </span>

        <span className="font-bold text-cyan-400">
          {utilization}%
        </span>

      </div>

      <div className="w-full h-4 bg-slate-700 rounded-full">

        <div
          className="h-4 bg-cyan-500 rounded-full"
          style={{
            width: `${utilization}%`,
          }}
        />

      </div>

    </div>

  );

})()}
            {/* PROGRESS */}
            <div className="mt-8">

              <div className="flex justify-between mb-2">

                <span>
                  {language === "hi"
                    ? "कार्य प्रगति"
                    : "Work Progress"}
                </span>

                <span>
                  {road.progress || 0}%
                </span>

              </div>

              <div className="w-full h-4 bg-slate-700 rounded-full">

                <div
                  className="h-4 bg-green-500 rounded-full"
                  style={{
                    width: `${road.progress || 0}%`,
                  }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ContractorDetails;