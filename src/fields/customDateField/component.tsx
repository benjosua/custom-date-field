import React, { useEffect, useState } from "react";
import { Props } from "payload/components/fields/DateTime";
import { DateTimeInput, Label, useField } from "payload/components/forms";
import Error from "payload/dist/admin/components/forms/Error/index";

import "./component.css"; // Import the CSS file

export const CustomDateComponent: React.FC<Props> = (props) => {
  const { path, label, required, validate } = props;
  const [options, setOptions] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  const {
    value = "",
    setValue,
    errorMessage,
    showError,
  } = useField<Date>({
    path,
    validate,
  });

  const classes = ["field-type", "date", showError && "error"]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    // Fetch events data on component mount
    const fetchEventsData = async () => {
      try {
        const response = await fetch(
          // `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/examples`
          "http://localhost:3000/api/examples"
        );

        console.log(response);

        const data = await response.json();
        console.log(data);


        setEventsData(data.docs);

        const times = data.docs.map((doc) => new Date(doc.customDate));
        setOptions(times);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", error);
      }
    };

    fetchEventsData();
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderDayContents = (day, date) => {
    // Filter events for the specified day
    const eventsForDay = eventsData.filter((event) => {
      const eventDate = new Date(event.end);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    // Create tooltip text with event titles, start times, and end times
    let tooltipText = `Events on ${date.toLocaleDateString()}:`;

    if (eventsForDay.length > 0) {
      eventsForDay.forEach((event) => {
        tooltipText += `\n- ${event.title} (Start: ${formatTime(
          new Date(event.start)
        )}, End: ${formatTime(new Date(event.end))})`;
      });
    } else {
      tooltipText += "\nNo events on this day";
    }

    const highlightedDayStyle = {
      backgroundColor: "rgb(255, 111, 118) !important",
    };

    return (
      <span title={tooltipText} style={highlightedDayStyle}>
        {date.getDate()}
      </span>
    );
  };

  return (
    <div className={classes}>
      <Label htmlFor={path} label={label} required={required} />
      <Error showError={showError} message={errorMessage} />
      <DateTimeInput
        path={path}
        datePickerProps={{
          overrides: {
            highlightDates: options,
            renderDayContents: renderDayContents,
          },
          pickerAppearance: "dayAndTime",
          timeIntervals: 15,
          timeFormat: "HH:mm",
          displayFormat: "MMM d, yyyy HH:mm",
        }}
        value={value && new Date(value)}
        onChange={(e) => setValue(e)}
        required={true}
      />
    </div>
  );
};
