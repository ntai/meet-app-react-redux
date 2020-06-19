import * as React from "react";
import {
    Grid,
    Card,
    CardContent,
    CardActionArea,
    CardHeader,
    Typography,
    CardActions,
    CardMedia,
    Theme, useTheme
} from "@material-ui/core";

import MaterialTable, {QueryResult, Query} from "material-table";
import {makeStyles} from "@material-ui/core/styles";
import {appStyleClasses} from "../../appStyleClasses";
import {connect, useStore} from "react-redux";
import {IRootState} from "../../../store";
import {TeamSliceState, TeamType} from "../../../store/teams/types";
import {useEffect, useState} from "react";
import {tableIcons} from "../../widgets/TableGoodies";
import {googlify} from "../../../appConfig/google";
// import AddBox from '@material-ui/icons/AddBox';
import AddTeam from '@material-ui/icons/GroupAdd';
import LinkIcon from '@material-ui/icons/Link';
import {Dispatch as ReduxDispatch} from 'redux';
import {
    TeamFetchCriteria,
    loadTeamsThunk1
} from "../../../store/teams/actions";
import {Simulate} from "react-dom/test-utils";
import {useAPIError} from "../../../helpers/APIErrorProvider";
import {ApiError} from "redux-api-middleware";

// const load = Simulate.load;

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

interface ITeams {
    allTeams: {[slug:string]: TeamType};
    keyedTeams: { [fetchPath: string]: TeamSliceState }; // slugs. You need to join this with allTeams
    current: string[];
    currentQS: string,
    currentPage: number;
    totalCount: number;
    isLoading: boolean;
    fetchTeams: (criteria: TeamFetchCriteria,
               successCB?: (teams: QueryResult<TeamType>) => void,
               rejectCB?: (reason: any) => void) => void,
}

function stripSlug(team: [string, TeamType]) : TeamType {
    return team[1];
}

function Teams( {allTeams, keyedTeams, currentQS, current, currentPage, totalCount, isLoading, fetchTeams} : ITeams)
{
    const theme:Theme = useTheme();
    const classes = useStyles(theme);
    const {addError} = useAPIError();

    const [needle, setNeedle] = useState({ search: "", page: 0, pageSize: 20 } as Query<TeamType>);

    console.log( `isLoading: ${isLoading} totalCount: ${totalCount} `);

    const teamActions = [
        {
            icon: () => <AddTeam />,
            tooltip: 'Add team',
            isFreeAction: true,
            onClick: () => null,
        },
    ];

    return (
        <Grid container className={classes.grid1Centered} >
            <MaterialTable<TeamType>
                style={ {width: "100%", minWidth: "800px"}}
                isLoading={isLoading}
                columns={[
                    { title: 'Name', field: 'name',
                        render: rowData => rowData.url ? <span> {rowData.name}<a href={rowData.url} target={"tab"}><LinkIcon /></a></span> : rowData.name,
                        headerStyle: {
                            maxWidth: 200,
                            width: "30%",
                            backgroundColor: '#eeeeff',
                        },
                        cellStyle: {
                            width: "30%",
                            maxWidth: 200,
                        },
                    },
                    { title: 'Owner', field: 'owner',
                        render: rowData => rowData.owner,
                        headerStyle: {
                            maxWidth: 200,
                            width: "30%",
                            backgroundColor: '#eeeeff',
                        },
                        cellStyle: {
                            width: "30%",
                            maxWidth: 200,
                        },
                    },
                    {
                        title: 'Description', field: 'description',
                        headerStyle: {
                            maxWidth: 100,
                            width: "40%",
                            backgroundColor: '#eeeeff',
                        },
                        cellStyle: {
                            maxWidth: 100,
                            width: "40%",
                        },
                    },
                ]}

                data={(query) => {
                    setNeedle(query);
                    return new Promise<QueryResult<TeamType>>( (successCB, rejectCB) => {
                        fetchTeams(query, successCB, (reason: ApiError) => {
                            const emptyResult: QueryResult<TeamType> = {
                                page: 0,
                                data: [],
                                totalCount: 0
                            };
                            successCB(emptyResult);
                            addError(reason.message + "  " + reason.response.detail, reason.status);
                        });
                    });
                }}

                icons={tableIcons}
                title="Teams"
                options={{
                    selection: false,
                    rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '', paddingTop: 2, paddingBottom: 2}),
                    paging: true,
                    pageSize: needle.pageSize,
                    draggable: false,
                    toolbar: true,
                    search: true,
                    showTitle: true,
                    padding: 'dense',
                    pageSizeOptions: [10, 20, 50],
                }}
                /* actions={teamActions} */
            />
        </Grid>
    );
}


function mapStateToProps( state: IRootState) {
    return {
        allTeams: state.teams.entities.allTeams,
        keyedTeams: state.teams.entities.keyedTeams,
        currentQS: state.teams.slice.fetchPath,
        current: state.teams.slice.teams,
        currentPage: state.teams.slice.page,
        totalCount: state.teams.slice.totalCount,
        isLoading: state.teams.entities.isFetching,
    }
};


const mapDispatchToProps = (dispatch : ReduxDispatch<any>) => ({
    fetchTeams:  (criteria: TeamFetchCriteria,
                successCB?: (teams: QueryResult<TeamType>) => void,
                rejectCB?: (reason: any) => void) => dispatch(loadTeamsThunk1(criteria, successCB, rejectCB)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Teams);
