import React, { useState, useEffect } from "react";
import moment from "moment";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline/lib";
import randomColor from "randomcolor";
import styles from "../App.module.css";
import { useTimetable } from "../utils/TimetableContext";

const keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

export default function PipelineView() {
  const { timetable, goodnessScore, goodnessBreakdown } = useTimetable();
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const defaultTimeStart = moment().startOf("day").hour(7).toDate();
  const defaultTimeEnd = moment().startOf("day").add(1, "day").toDate();

  useEffect(() => {
    if (timetable) {
      const { groups, items } = processTimetableData(timetable);
      setGroups(groups);
      setItems(items);
    }
  }, [timetable]);

  const processTimetableData = (timetable) => {
    let groups = [];
    let items = [];
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let uniqueSessions = new Set();

    daysOfWeek.forEach((day, dayIndex) => {
      groups.push({
        id: `${dayIndex + 1}`,
        title: day,
        rightTitle: `Lastname ${dayIndex + 1}`,
      });

      timetable.flat().forEach((session, index) => {
        if (!session) return;

        // Create a unique identifier for each session to avoid duplicates
        let sessionIdentifier = `${session.unitCode}-${session.dayOfWeek}-${session.startTime}-${session.endTime}-${session.sessionType}`;

        // Check if sessionIdentifier already exists
        if (uniqueSessions.has(sessionIdentifier)) return;
        uniqueSessions.add(sessionIdentifier);

        let groupId;
        switch (session.dayOfWeek.toLowerCase()) {
          case "monday":
            groupId = 1;
            break;
          case "tuesday":
            groupId = 2;
            break;
          case "wednesday":
            groupId = 3;
            break;
          case "thursday":
            groupId = 4;
            break;
          case "friday":
            groupId = 5;
            break;
          default:
            console.warn(`Invalid day of week: ${session.dayOfWeek}`);
            return;
        }

        const startTime = moment(session.startTime, "HH:mm");
        const endTime = moment(session.endTime, "HH:mm");

        items.push({
          id: `${dayIndex}_${index}`,
          group: `${groupId}`,
          title: `${session.unitCode}.${session.sessionType}`,
          start: startTime.valueOf(),
          end: endTime.valueOf(),
          canMove: false,
          canResize: false,
          bgColor: randomColor({
            luminosity: "light",
            seed: session.unitCode,
          }),
          selectedBgColor: randomColor({
            luminosity: "light",
            seed: session.unitCode,
          }),
          unitCode: session.unitCode,
          dayOfWeek: session.dayOfWeek,
          sessionType: session.sessionType,
          startTime: session.startTime,
          endTime: session.endTime,
          durationHours: session.durationHours,
          staffName: session.staffName,
          venueName: session.venueName,
          venueLocation: session.venueLocation,
        });
      });
    });

    return { groups, items };
  };

  const onItemClickHandler = (itemId) => {
    const clickedItem = items.find((item) => item.id === itemId);
    if (clickedItem) {
      const {
        dayOfWeek,
        durationHours,
        endTime,
        sessionType,
        staffName,
        startTime,
        unitCode,
        venueLocation,
        venueName,
      } = clickedItem;
      const itemDetails = `
        Unit Code: ${unitCode}
        Session Type: ${sessionType}
        Staff Name: ${staffName}
        Venue Name: ${venueName}
        Venue Location: ${venueLocation}
        Day of Week: ${dayOfWeek}
        Start Time: ${startTime}
        End Time: ${endTime}
        Duration (hours): ${durationHours}     
      `;

      alert(itemDetails);
    }
  };

  const itemRenderer = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps,
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = itemContext.selected
      ? itemContext.dragging
        ? "red"
        : item.selectedBgColor
      : item.bgColor;
    const borderColor = itemContext.resizing ? "red" : item.bgColor;
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            borderColor,
            fontWeight: "bold",
            color: "black",
            border: itemContext.selected
              ? "dashed 1px rgba(0,0,0,0.3)"
              : "none",
            borderRadius: 4,
            boxShadow: `0 1px 5px 0 rgba(0, 0, 0, 0.2),
                     0 2px 2px 0 rgba(0, 0, 0, 0.14),
                     0 3px 1px -2px rgba(0, 0, 0, 0.12)`,
          },
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.7rem",
            marginLeft: "0.4rem",
          }}
        >
          {itemContext.title}
        </div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  };

  return (
    <div>
      <div className={styles.warningBox}>
        <strong>Rendering Issue:</strong> We're currently experiencing some
        display issues. You may need to inspect the page or scroll horizontally
        to view the full timetable.
      </div>
      <div className={styles.headerRow}>
        <div className={styles.goodnessSummaryBox}>
          <div className={styles.goodnessValueBox}>
            Timetable Goodness:{" "}
            <span className={styles.goodnessValue}>
              {goodnessScore ? `${goodnessScore.toFixed(2)}` : "N/A"}
            </span>
          </div>
          <div className={styles.goodnessBreakdownBox}>
            <h4>Goodness Score Breakdown</h4>
            <div className={styles.breakdownContainer}>
              <div className={styles.breakdownItem}>
                <label>Venue Optimization:</label>
                <div className={styles.breakdownBar}>
                  {goodnessBreakdown.venue_optimization_final_score.toFixed(2)}{" "}
                  / 40
                </div>
              </div>
              <div className={styles.breakdownItem}>
                <label>Unit Conflict:</label>
                <div className={styles.breakdownBar}>
                  {goodnessBreakdown.unit_conflict_final_score.toFixed(2)} / 60
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        lineHeight={60}
        canMove={false}
        canResize={false}
        onItemClick={onItemClickHandler}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        itemRenderer={itemRenderer}
        sidebarWidth={100}
      >
        <TimelineHeaders className="sticky">
          <SidebarHeader>
            {({ getRootProps }) => {
              return <div {...getRootProps()}>Weekday</div>;
            }}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
      </Timeline>
    </div>
  );
}
