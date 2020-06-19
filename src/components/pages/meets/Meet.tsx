/*
Creating and editing meet.
 */

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
    Button,
    Theme, useTheme, TextField, Hidden
} from "@material-ui/core";

import {makeStyles} from "@material-ui/core/styles";
import {appStyleClasses} from "../../appStyleClasses";
import {connect, useStore} from "react-redux";
import {IRootState} from "../../../store";
import {useEffect, useState} from "react";
// import {getMeets} from "../../../locations/actions";
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationSelect from "../../widgets/LocationSelect";
import {Query} from "material-table";
import {MeetType} from "../../../store/meets/types";
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';
import EnhancedButton from "material-ui/internal/EnhancedButton";

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

interface OtherProps {
    creating: boolean;
    title: string;
}

interface MeetFormValues {
    slug: string | undefined;
    // season = models.ForeignKey(Season, related_name="season", on_delete=models.SET_NULL, null=True, blank=True)
    name: string; // = models.CharField(max_length=100, default='Unnamed Event')
    team: string; // team's slug = models.ForeignKey(Team, related_name="team", on_delete=models.SET_NULL, null=True, blank=True)
    // group = models.ForeignKey(Group, related_name="group", on_delete=models.SET_NULL, null=True, blank=True)
    starttime: number; // = models.DateTimeField('Meet date/time')
    duration: number; // = models.DurationField('Duration', default=datetime.timedelta(minutes=90))
    location: string; // location slug = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    manager: string | undefined; // username = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    min_attendees: number; // = models.PositiveIntegerField(default=1)
    max_attendees: number; // = models.PositiveIntegerField(default=1)
    comments: string | undefined; // = models.CharField(max_length=200, null=True, blank=True, default='')
    meet_reminder: number | undefined; // = models.DateTimeField('Time to send the next reminder', default=datetime.datetime(2001, 1, 1, tzinfo=pytz.UTC))
}

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code..
// InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST
// wrap all props (it passes them through).

// https://jaredpalmer.com/formik/docs/guides/typescript
const MeetInnerForm = (props: OtherProps & FormikProps<MeetFormValues>) => {
    const { touched, errors, isSubmitting, title } = props;
    return (
        <Card>
            <Form>
                <CardHeader title={title} />
                <CardContent>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item sm={6}>
                            <TextField style={ {width: "100%"} } id={"name"} name="name" label={"Meet name" + (errors.name ? " *" : "")}/>
                        </Grid>
                        <Grid item sm={3}>
                            <LocationSelect key={"location"} />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button variant={"contained"} color={"primary"} type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </CardActions>
            </Form>
        </Card>
    );
};

// The type of props MyForm receives
interface MeetFormProps {
    creating: boolean;
    title: string;
    initialSlug: string | undefined;
    // season = models.ForeignKey(Season, related_name="season", on_delete=models.SET_NULL, null=True, blank=True)
    initialName: string; // = models.CharField(max_length=100, default='Unnamed Event')
    initialTeam: string; // team's slug = models.ForeignKey(Team, related_name="team", on_delete=models.SET_NULL, null=True, blank=True)
    // group = models.ForeignKey(Group, related_name="group", on_delete=models.SET_NULL, null=True, blank=True)
    initialStarttime: number; // = models.DateTimeField('Meet date/time')
    initialDuration: number; // = models.DurationField('Duration', default=datetime.timedelta(minutes=90))
    initialLocation: string; // location slug = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    initialManager?: string | undefined; // username = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    initialMin_attendees: number; // = models.PositiveIntegerField(default=1)
    initialMax_attendees: number; // = models.PositiveIntegerField(default=1)
    initialComments?: string | undefined; // = models.CharField(max_length=200, null=True, blank=True, default='')
    initialMeet_reminder?: number|undefined; // = models.DateTimeField('Time to send the next reminder', default=datetime.datetime(2001, 1, 1, tzinfo=pytz.UTC))
}

// Wrap our form with the withFormik HoC
const MeetForm = withFormik<MeetFormProps, MeetFormValues>({
    // Transform outer props into form values
    mapPropsToValues: props => {
        return {
            slug: props.initialSlug || '',
            name: props.initialName || '',
            team: props.initialTeam || '',
            starttime: props.initialStarttime,
            duration: props.initialDuration,
            location: props.initialLocation,
            manager: props.initialManager,
            min_attendees: props.initialMin_attendees,
            max_attendees: props.initialMax_attendees,
            comments: props.initialComments,
            meet_reminder: props.initialMeet_reminder,
        };
    },

    // Add a custom validation function (this can be async too!)
    validate: (values: MeetFormValues) => {
        let errors: FormikErrors<MeetFormValues> = {};
        if (!values.name) {
            errors.name = 'Required';
        }
        return errors;
    },

    handleSubmit: values => {
        // do submitting things
    },
})(MeetInnerForm);

function mapStateToProps( state: IRootState) {
    return {
        currentQS: state.locations.slice.fetchPath,
        current: state.locations.slice.locations,
        currentPage: state.locations.slice.page,
        totalCount: state.locations.slice.totalCount,
        isLoading: state.locations.entities.isFetching,
    }
};

const mapDispatchToProps = {
    // fetchMeet: getMeets,
    fetchMeet: () => null,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MeetForm);
