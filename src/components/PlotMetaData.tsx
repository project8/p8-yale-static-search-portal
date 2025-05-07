import { Box, HStack } from "@chakra-ui/react";
import React from "react";
//import Plot from 'react-plotly.js';
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })


function process_metadata_json(result) {

    const shortTracks = 1.e-6; // cut for short tracks

    var avg_frequency = [];
    var start_radius = [];
    var electron_energy = [];
    var track_length = [];
    var first_track_length = [];
    var start_time = [];
    var ntracks = [];

    console.log(result);

    var raw_data = [];

    try {
        raw_data = result?.gmeta?.map((x) => JSON.parse(x?.entries[0]?.content?.raw_metadata));
    }
    catch (err) {
        return ({
            "avg_frequency": [],
            "start_radius": [],
            "electron_energy": [],
            "track_length": [],
            "first_track_length": [],
            "start_time": [],
            "ntracks": []
        });
    }

    raw_data.forEach((data) => {
        for (let ievent = 0; ievent < data?.nevents; ievent++) {
            ntracks.push(data?.[ievent.toString()]?.ntracks);
            for (let itrack = 0; itrack < data?.[ievent.toString()]?.ntracks; itrack++) {
                if ((data?.[ievent.toString()]?.[itrack.toString()]?.["end-time"] - data?.[ievent.toString()]?.[itrack.toString()]?.["start-time"]) > shortTracks) {  // Select stably-trapped electrons:                            
                    avg_frequency.push(data?.[ievent.toString()]?.[itrack.toString()]?.["output-avg-frequency"]);
                    start_radius.push(data?.[ievent.toString()]?.[itrack.toString()]?.["start-radius"]);
                    electron_energy.push(data?.[ievent.toString()]?.[itrack.toString()]?.["energy-ev"]);
                    track_length.push(data?.[ievent.toString()]?.[itrack.toString()]?.["end-time"] - data?.[ievent.toString()]?.[itrack.toString()]?.["start-time"]);
                    if (itrack == 0) {
                        first_track_length.push(data?.[ievent.toString()]?.[itrack.toString()]?.["end-time"] - data?.[ievent.toString()]?.[itrack.toString()]?.["start-time"]);
                        start_time.push(data?.[ievent.toString()]?.[itrack.toString()]?.["start-time"]);
                    }
                }
            }
        }
    });

    return ({
        "avg_frequency": avg_frequency,
        "start_radius": start_radius,
        "electron_energy": electron_energy,
        "track_length": track_length,
        "first_track_length": first_track_length,
        "start_time": start_time,
        "ntracks": ntracks
    });
}

export const PlotMetaData = ({ result }) => {

    return (
        <Box>
            Graphs go here
            <HStack h="400px">
                <Plot
                    data={[{
                        type: 'scatter',
                        mode: 'markers',
                        x: process_metadata_json(result).start_time,
                        y: process_metadata_json(result).track_length,
                        marker: { color: 'red' }
                    },]}

                    layout={{
                        //width: 640,
                        //height: 480,
                        title: 'Scatter 1',
                        xaxis: {
                            title: {
                                text: 'first track start time (s)'
                            }
                        },
                        yaxis: {
                            title: {
                                text: 'first track length (s)'
                            }
                        }
                    }}

                    useResizeHandler={true}
                    style={{ width: "25%", height: "100%" }}

                />
                <Plot
                    data={[
                        {
                            type: 'histogram',
                            xbins: {
                                end: 21,
                                size: 1.0,
                                start: 0
                            },
                            x: process_metadata_json(result).ntracks,
                            marker: { color: 'red' }
                        }]}

                    layout={{
                        //width: 640,
                        //height: 480,
                        title: 'Hist 1',
                        xaxis: {
                            range: [0, 21],
                            title: {
                                text: 'n tracks per event'
                            }
                        },
                        yaxis: {
                            title: {
                                text: 'counts'
                            }
                        }
                    }}

                    useResizeHandler={true}
                    style={{ width: "25%", height: "100%" }}

                />
            </HStack>
        </Box>
    );
};
