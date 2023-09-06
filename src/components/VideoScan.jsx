import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Image from "image-js";
import pixelmatch from "pixelmatch";
import u8intTracks from "../u8intarrays/tracks/index.js";
import u8intPlacements from "../u8intarrays/placements/index.js";
import { useCookies } from "react-cookie";

const SLEEP_TIME = 1.5;
const PIXEL_DIFF_TRACK_THRESHOLD = 2000;
const PIXEL_DIFF_PLACEMENT_THRESHOLD = 1337;

const VideoScan = ({ setTrackData, trackDataRef, displayVideo }) => {
  const [cookies, setCookie] = useCookies(["videoSource"]);
  const [deviceId, setDeviceId] = useState("");
  const [displaySources, setDisplaySources] = useState([]);
  const video = useRef(null);
  const mediaObject = useRef({});

  const analyzeImage = () => {
    const track = mediaObject.current.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    imageCapture.takePhoto().then((blob) => {
      Image.load(URL.createObjectURL(blob)).then((image) => {
        if (
          trackDataRef.current.length === 0 ||
          trackDataRef.current[trackDataRef.current.length - 1][2] !== null
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
            if (output < PIXEL_DIFF_TRACK_THRESHOLD) {
              console.log(
                `Current Track: ${u8intarray[0]}, pixelDiff: ${output}`
              );
              trackDataRef.current.push([u8intarray[0], null, null]);
              setTrackData([...trackDataRef.current]);
            }
          }
        } else if (
          trackDataRef.current[trackDataRef.current.length - 1][1] == null
        ) {
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

            if (output < PIXEL_DIFF_PLACEMENT_THRESHOLD) {
              console.log(`Found Position: ${i + 1}, pixelDiff: ${output}`);
              trackDataRef.current[trackDataRef.current.length - 1][1] = i + 1;
              if (i > 6) {
                trackDataRef.current[trackDataRef.current.length - 1][2] =
                  image.toDataURL();
              }
              setTrackData([...trackDataRef.current]);
              return;
            }
          }
        } else {
          trackDataRef.current[trackDataRef.current.length - 1][2] =
            image.toDataURL();
          setTrackData([...trackDataRef.current]);
        }
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (mediaObject.current.constructor.name === "MediaStream")
        analyzeImage();
    }, SLEEP_TIME * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function getSources() {
      await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          let filteredDevices = devices.filter(
            (device) => device.deviceId !== ""
          );
          if (filteredDevices.length > 0) {
            let cookieDeviceIndex = filteredDevices.findIndex(
              (source) => source.deviceId === cookies.videoSource
            );
            if (cookieDeviceIndex !== -1) {
              const chosenDevice = filteredDevices[cookieDeviceIndex];
              filteredDevices = filteredDevices.filter(
                (device) => device.deviceId !== cookies.videoSource
              );
              filteredDevices.unshift(chosenDevice);
            }
            setDeviceId(filteredDevices[0].deviceId);
          }
          setDisplaySources(filteredDevices);
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
      mediaObject.current = mediaStream;
      video.current.srcObject = mediaStream;
    }
    if (displaySources.length !== 0 && displayVideo === "show") {
      getMedia();
    }
  }, [deviceId, displayVideo]);

  const videoSources = displaySources.map((source, index) => {
    return (
      <option value={source.deviceId} key={index}>
        {source.label}
      </option>
    );
  });

  return (
    <div className="m-3 text-center">
      <div className="pb-2">
        {displayVideo === "show" ? (
          <video
            className="m-auto"
            height="360px"
            width="640px"
            autoPlay="autoplay"
            ref={video}
          />
        ) : (
          <div>
            <div
              className="m-auto"
              style={{
                height: "360px",
                width: "640px",
                backgroundColor: "black",
              }}
            />
            <div className="pb-2" />
          </div>
        )}
      </div>
      <Form.Select
        className="m-auto w-75"
        onChange={(e) => {
          setCookie("videoSource", e.target.value);
          return setDeviceId(e.target.value);
        }}
      >
        {videoSources}
      </Form.Select>
    </div>
  );
};

export default VideoScan;
