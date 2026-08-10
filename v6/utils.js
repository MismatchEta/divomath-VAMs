/**
 * utils.js
 * Helper functions for sending learning-analytics events to the logging API.
 */

// ===================== //
// Logging API constants //
// ===================== //

const LOGGING_API_URL = "https://grk.mismatcheta.org/api/events/insert.php";


// ========================= //
// Generic API communication //
// ========================= //

async function sendRawEventToApi(programid, scenarioid, userid, event) {
  const payload = {
    programid: String(programid),
    scenarioid: String(scenarioid),
    userid: String(userid),
    event: event
  };

  try {
    const response = await fetch(LOGGING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.warn("Logging API returned an error:", result);
    } else {
      console.debug("Logging API success:", result);
    }

    return result;

  } catch (error) {
    console.error("Logging API request failed:", error);
    return null;
  }
}


// ===================== //
// Generic event sending //
// ===================== //

// Experimental: only use when CindyScript sends a proper JS object.
// For now, prefer the specific event functions below.
function sendEventToApi(programid, scenarioid, userid, event) {
  return sendRawEventToApi(programid, scenarioid, userid, event);
}


// ======================== //
// Specific event functions //
// ======================== //

function sendStartedEventToApi(programid, scenarioid, userid, eventid) {
  return sendRawEventToApi(programid, scenarioid, userid, {
    eventid: Number(eventid),
    type: "system",
    name: "started",
    source: "cindyscript",
    clienttime: Date.now(),
    data: {}
  });
}


function sendButtonClickedEventToApi(programid, scenarioid, userid, eventid, buttonid) {
  return sendRawEventToApi(programid, scenarioid, userid, {
    eventid: Number(eventid),
    type: "interaction",
    name: "button_clicked",
    source: "cindyscript",
    clienttime: Date.now(),
    data: {
      buttonid: String(buttonid)
    }
  });
}


function sendGeometryEventToApi(
  programid,
  scenarioid,
  userid,
  eventid,
  eventname,
  objectname,
  algorithm,
  inputs
) {
  return sendRawEventToApi(programid, scenarioid, userid, {
    eventid: Number(eventid),
    type: "geometry",
    name: String(eventname),
    source: "cindyscript",
    clienttime: Date.now(),
    data: {
      object: String(objectname),
      algorithm: String(algorithm),
      inputs: String(inputs)
    }
  });
}


function sendPointMovedEventToApi(programid, scenarioid, userid, eventid, pointname, x, y) {
  return sendRawEventToApi(programid, scenarioid, userid, {
    eventid: Number(eventid),
    type: "geometry",
    name: "point_moved",
    source: "cindyscript",
    clienttime: Date.now(),
    data: {
      point: String(pointname),
      x: Number(x),
      y: Number(y)
    }
  });
}


function sendStampedPointEventToApi(
  programid,
  scenarioid,
  userid,
  eventid,
  pointname,
  x,
  y,
  angle
) {
  return sendRawEventToApi(programid, scenarioid, userid, {
    eventid: Number(eventid),
    type: "interaction",
    name: "point_stamped",
    source: "cindyscript",
    clienttime: Date.now(),
    data: {
      point: String(pointname),
      x: Number(x),
      y: Number(y),
      angle: Number(angle)
    }
  });
}


function sendMouseEventToApi(programid, scenarioid, userid, eventid, action, x, y, target) {
  return sendRawEventToApi(programid, scenarioid, userid, {
    eventid: Number(eventid),
    type: "input",
    name: String(action),
    source: "cindyscript",
    clienttime: Date.now(),
    data: {
      pointer: "mouse",
      x: Number(x),
      y: Number(y),
      target: target === "-" ? null : String(target)
    }
  });
}