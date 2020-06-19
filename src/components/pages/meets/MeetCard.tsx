import {MeetType} from "../../../store/meets/types";
import {Card, CardHeader, GridListTile} from "@material-ui/core";
import * as React from "react";

interface IMeetCard {
    meet: MeetType;
}

export default function MeetCard( {meet} :IMeetCard) {
    return (
        <Card style={{minWidth: "400px", boxShadow: "6px", border: "1px"}}>
            <CardHeader title={meet.name} />
            {meet.startTime}
        </Card>);
}
