import { Box, HStack } from "@chakra-ui/react";
import React from "react";
// import Plot from 'react-plotly.js';
import { GSearchResult } from "@globus/sdk/services/search/service/query";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type LocustTrack = {
  ["start-time"]: number;
  ["end-time"]: number;
  ["output-avg-frequency"]: number;
  ["start-radius"]: number;
  ["energy-ev"]: number;
};

type LocustEvent = {
  ntracks?: number;
  [key: number]: LocustTrack;
};

type LocustMetaData = {
  nevents?: number;
  [key: number]: LocustEvent;
};

type MetaDataSummary = {
  AvgFrequency: number[];
  StartRadius: number[];
  ElectronEnergy: number[];
  TrackLength: number[];
  FirstTrackLength: number[];
  StartTime: number[];
  nTracks: number[];
};

function ProcessMetaData(result: GSearchResult): MetaDataSummary {
  const shortTracks = 1e-6; // cut for short tracks

  const AvgFrequency: number[] = [];
  const StartRadius: number[] = [];
  const ElectronEnergy: number[] = [];
  const TrackLength: number[] = [];
  const FirstTrackLength: number[] = [];
  const StartTime: number[] = [];
  const nTracks: number[] = [];

  console.log(result);

  let RawData: LocustMetaData[] = [];

  try {
    RawData = result?.gmeta?.map((x: any) =>
      JSON.parse(x?.entries[0]?.content?.raw_metadata),
    );
  } catch (err) {
    return {
      AvgFrequency: [],
      StartRadius: [],
      ElectronEnergy: [],
      TrackLength: [],
      FirstTrackLength: [],
      StartTime: [],
      nTracks: [],
    };
  }

  RawData.forEach((data) => {
    for (let iEvent: number = 0; iEvent < (data?.nevents ?? 0); iEvent++) {
      nTracks.push(data?.[iEvent]?.ntracks ?? 0);
      for (let iTrack = 0; iTrack < (data?.[iEvent]?.ntracks ?? 0); iTrack++) {
        if (
          (data?.[iEvent]?.[iTrack]?.["end-time"] ?? 0) -
            (data?.[iEvent]?.[iTrack]?.["start-time"] ?? 0) >
          shortTracks
        ) {
          // Select stably-trapped electrons:
          AvgFrequency.push(
            data?.[iEvent]?.[iTrack]?.["output-avg-frequency"] ?? 0,
          );
          StartRadius.push(data?.[iEvent]?.[iTrack]?.["start-radius"]);
          ElectronEnergy.push(data?.[iEvent]?.[iTrack]?.["energy-ev"]);
          TrackLength.push(
            data?.[iEvent]?.[iTrack]?.["end-time"] -
              data?.[iEvent]?.[iTrack]?.["start-time"],
          );
          if (iTrack === 0) {
            FirstTrackLength.push(
              data?.[iEvent]?.[iTrack]?.["end-time"] -
                data?.[iEvent]?.[iTrack]?.["start-time"],
            );
            StartTime.push(data?.[iEvent]?.[iTrack]?.["start-time"]);
          }
        }
      }
    }
  });

  return {
    AvgFrequency,
    StartRadius,
    ElectronEnergy,
    TrackLength,
    FirstTrackLength,
    StartTime,
    nTracks,
  };
}

export const PlotMetaData = ({ result }: { result: GSearchResult }) => {
  return (
    <Box>
      Graphs go here
      <HStack h="400px">
        <Plot
          data={[
            {
              type: "scatter",
              mode: "markers",
              x: ProcessMetaData(result).StartTime,
              y: ProcessMetaData(result).TrackLength,
              marker: { color: "blue" },
            },
          ]}
          layout={{
            // width: 640,
            // height: 480,
            title: {
              text: "Scatter 1",
            },
            xaxis: {
              title: {
                text: "first track start time (s)",
              },
            },
            yaxis: {
              title: {
                text: "first track length (s)",
              },
            },
          }}
          useResizeHandler
          style={{ width: "25%", height: "100%" }}
        />
        <Plot
          data={[
            {
              type: "histogram",
              xbins: {
                end: 21,
                size: 1.0,
                start: 0,
              },
              x: ProcessMetaData(result).nTracks,
              marker: { color: "red" },
            },
          ]}
          layout={{
            // width: 640,
            // height: 480,
            title: {
              text: "Hist 1",
            },
            xaxis: {
              range: [0, 21],
              title: {
                text: "n tracks per event",
              },
            },
            yaxis: {
              title: {
                text: "counts",
              },
            },
          }}
          useResizeHandler
          style={{ width: "25%", height: "100%" }}
        />
        <Plot
          data={[
            {
              type: "histogram",
              xbins: {
                end: 21,
                size: 1.0,
                start: 0,
              },
              x: ProcessMetaData(result).nTracks,
              marker: { color: "red" },
            },
          ]}
          layout={{
            // width: 640,
            // height: 480,
            title: {
              text: "Hist 1",
            },
            xaxis: {
              range: [0, 21],
              title: {
                text: "n tracks per event",
              },
            },
            yaxis: {
              title: {
                text: "counts",
              },
            },
          }}
          useResizeHandler
          style={{ width: "25%", height: "100%" }}
        />


        
      </HStack>
    </Box>
  );
};
