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

  const getEventsForSelectedDay = () => {
    const selectedDate = value instanceof Date ? value : new Date(); // Ensure it's a Date object
    if (selectedDate instanceof Date) {
      const eventsForSelectedDay = eventsData.filter((event) => {
        const eventDate = new Date(event.customDate);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      return eventsForSelectedDay;
    }
    return [];
  };

  useEffect(() => {
    // Fetch events data on component mount
    const fetchEventsData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/examples");
        const data = await response.json();
        setEventsData(data.docs);
        const times = data.docs.map((doc) => new Date(doc.customDate));
        setOptions(times);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEventsData();
  }, []);

  const warningMessage = getEventsForSelectedDay().length > 0 ? `WARNING! There are ${getEventsForSelectedDay().length} other events on this day: ${getEventsForSelectedDay().map((event) => `${event.title} (Date: ${new Date(event.customDate).toLocaleString()})`).join(', ')}` : '';

  return (
    <div className={classes}>
      <Label htmlFor={path} label={label} required={required} />
      <Error showError={showError} message={errorMessage} />
      <DateTimeInput
        path={path}
        datePickerProps={{
          overrides: {
            highlightDates: options,
          },
          pickerAppearance: "dayAndTime",
          timeIntervals: 15,
          timeFormat: "HH:mm",
          displayFormat: "MMM d, yyyy HH:mm",
        }}
        value={value && new Date(value)}
        onChange={(e) => setValue(e)}
        required={true}
        description={
          (value ? `\n${warningMessage}` : "")
        }
      />
    </div>
  );
};
