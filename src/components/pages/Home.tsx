import * as React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {GridList, Grid, GridListTile, Card, CardHeader, Typography} from "@material-ui/core";
import {LocationType} from "../../store/locations/types";
import {MeetType} from "../../store/meets/types";
import MeetCard from "./meets/MeetCard";

export default function Home () {
    const [meets, setMeets] = React.useState<MeetType[]>([
        {
            slug: "test_1", // slug
            name: "Test 1",
            min_attendees: 1,
            max_attendees: 4,
            team: "foo",
            description: "foo",
            startTime: 1000,
            duration: 10,
            manager: "someone",
            meet_reminder: 0,
            comments: "",
        },

        {
            slug: "test_2", // slug
            name: "Test 2",
            min_attendees: 1,
            max_attendees: 4,
            team: "foo",
            description: "foo",
            startTime: 1000,
            duration: 10,
            manager: "someone",
            meet_reminder: 0,
            comments: "",
        },
    ]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <Typography>
                    Upcoming Events
                </Typography>
                <GridList cellHeight={"auto"} cols={1}>
                    {meets.map((meet) => (
                        <GridListTile key={meet.slug} cols={1}>
                            <MeetCard meet={meet} />
                        </GridListTile>
                    ))}
                </GridList>
            </Grid>
            <Grid item  xs={3}>
                <Grid item>
                    <Calendar />
                </Grid>
            </Grid>
        </Grid>
     );
}
