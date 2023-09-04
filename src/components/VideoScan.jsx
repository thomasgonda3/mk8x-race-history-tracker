import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Image from "image-js";
import pixelmatch from "pixelmatch";
import u8intTracks from "../u8intarrays/tracks/index.js";
import u8intPlacements from "../u8intarrays/placements/index.js";

const isProduction = true;

const SLEEP_TIME = 2.3;
const PIXEL_DIFF_THRESHOLD = 2000;
// for some reason usestate wont save a MediaStream object, and since
// the analyzeImage function gets called every few seconds theres no need
// to have it saved to a state to trigger a rerender, so this seems ok.
let mediaObject = {};

const VideoScan = ({ setTrackData }) => {
  const [croppedImage, setCroppedImage] = useState({});
  const [deviceId, setDeviceId] = useState("");
  const [displaySources, setDisplaySources] = useState([]);
  const video = useRef(null);
  const trackDataRef = useRef([]);

  const analyzeImage = () => {
    const track = mediaObject.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    imageCapture.takePhoto().then((blob) => {
      Image.load(URL.createObjectURL(blob)).then((image) => {
        if (
          trackDataRef.current.length === 0 ||
          trackDataRef.current[trackDataRef.current.length - 1][1] !== null
        ) {
          const rgbaImage = image
            .resize({ width: 1920, height: 1080 })
            .crop({
              x: 1405,
              y: 930,
              width: 190,
              height: 120,
            })
            .rgba8();

          let currTrack = "";
          let pixelDiff = 0;
          // console.time("match test");
          for (const u8intarray of u8intTracks) {
            const output = pixelmatch(
              rgbaImage.data,
              u8intarray[1],
              null,
              190,
              120,
              {
                threshold: 0.15,
              }
            );
            if (output < PIXEL_DIFF_THRESHOLD) {
              pixelDiff = output;
              currTrack = u8intarray[0];
              //   console.log("trackData", trackData);
              //   console.log("ref", trackDataRef);
              trackDataRef.current.push([u8intarray[0], null, null]);
              setTrackData([...trackDataRef.current]);
            }
          }
          // console.timeEnd("match test");
          console.log(
            currTrack !== ""
              ? `Current Track: ${currTrack}, pixelDiff: ${pixelDiff}`
              : `No match.`
          );
          const url = rgbaImage.toDataURL();
          setCroppedImage(url);
        } else {
          const resized = image.resize({ width: 1920, height: 1080 });
          for (let i = 0; i < 12; i++) {
            const rgbaImage = resized
              .crop({
                x: 830,
                y: 80 + 78 * i,
                width: 100,
                height: 62,
              })
              .rgba8();

            const output = pixelmatch(
              rgbaImage.data,
              u8intPlacements[i],
              null,
              100,
              62
            );

            if (output < PIXEL_DIFF_THRESHOLD) {
              console.log(`It's a match ${i + 1}`);
              trackDataRef.current[trackDataRef.current.length - 1][1] = i + 1;
              trackDataRef.current[trackDataRef.current.length - 1][2] =
                image.toDataURL();
              setTrackData([...trackDataRef.current]);
              return;
            }
          }
        }
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (mediaObject.constructor.name === "MediaStream") analyzeImage();
    }, SLEEP_TIME * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function getSources() {
      navigator.mediaDevices
        .getUserMedia({ audio: false, video: true })
        .then(() => {
          console.log("ask permission");
        });
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          console.log(devices);
          const filteredDevices = devices.filter(
            (device) => device.deviceId !== ""
          );
          setDisplaySources(filteredDevices);
          if (filteredDevices.length > 0) {
            setDeviceId(filteredDevices[0].deviceId);
          }
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    }
    getSources();
  }, []);

  useEffect(() => {
    async function getMedia() {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: {
            exact: deviceId,
          },
        },
      });
      mediaObject = mediaStream;
      video.current.srcObject = mediaStream;
    }
    if (displaySources.length !== 0) {
      getMedia();
    }
  }, [deviceId]);

  const videoSources = displaySources.map((source, index) => {
    return (
      <option value={source.deviceId} key={index}>
        {source.label}
      </option>
    );
  });

  return (
    <div className="m-3 text-center">
      <video
        className="m-2"
        height="360px"
        width="640px"
        autoPlay="autoplay"
        ref={video}
      ></video>
      <Form.Select
        className="m-auto w-75"
        onChange={(e) => {
          return setDeviceId(e.target.value);
        }}
      >
        {videoSources}
      </Form.Select>
      {isProduction ? <></> : <img src={croppedImage}></img>}
    </div>
  );
};

export default VideoScan;
