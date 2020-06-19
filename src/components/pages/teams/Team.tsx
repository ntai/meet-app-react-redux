/*
Creating and editing team.
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
// import {getTeams} from "../../../locations/actions";
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationSelect from "../../widgets/LocationSelect";
import {Query} from "material-table";
import {TeamType} from "../../../store/teams/types";
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';
import EnhancedButton from "material-ui/internal/EnhancedButton";

const useStyles = makeStyles((theme: Theme) => appStyleClasses(theme));

interface OtherProps {
    creating: boolean;
    title: string;
}

interface TeamFormValues {
    slug: string | undefined;
    name: string; // = models.CharField(max_length=100, default='Unnamed Event')
    description: string;
    category: string; // = models.
}

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code..
// InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST
// wrap all props (it passes them through).

// https://jaredpalmer.com/formik/docs/guides/typescript
const TeamInnerForm = (props: OtherProps & FormikProps<TeamFormValues>) => {
    const { touched, errors, isSubmitting, title } = props;
    return (
        <Card>
            <Form>
                <CardHeader title={title} />
                <CardContent>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item sm={6}>
                            <TextField style={ {width: "100%"} } id={"name"} name="name" label={"Team name" + (errors.name ? " *" : "")}/>
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
interface TeamFormProps {
    creating: boolean;
    title: string;
    initialSlug: string | undefined;
    // season = models.ForeignKey(Season, related_name="season", on_delete=models.SET_NULL, null=True, blank=True)
    initialName: string; // = models.CharField(max_length=100, default='Unnamed Event')
    initialDescription: string;
    initialCategory: string;
}

// Wrap our form with the withFormik HoC
const TeamForm = withFormik<TeamFormProps, TeamFormValues>({
    // Transform outer props into form values
    mapPropsToValues: props => {
        return {
            slug: props.initialSlug || '',
            name: props.initialName || '',
            description: props.initialDescription || '',
            category: props.initialCategory || '',
        };
    },

    // Add a custom validation function (this can be async too!)
    validate: (values: TeamFormValues) => {
        let errors: FormikErrors<TeamFormValues> = {};
        if (!values.name) {
            errors.name = 'Required';
        }
        return errors;
    },

    handleSubmit: values => {
        // do submitting things
    },
})(TeamInnerForm);

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
    // fetchTeam: getTeams,
    fetchTeam: () => null,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TeamForm);
