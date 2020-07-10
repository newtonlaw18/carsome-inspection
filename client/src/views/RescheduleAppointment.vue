<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-md-4 col-lg-4 col-xl-4 px-lg-5">
        <h1 class="text-center mb-1" v-if="!update_inspection_successful">Welcome to Carsome!</h1>
        <p class="text-muted text-center" v-if="!update_inspection_successful">Please update the form below to reschedule.</p>
        <div v-if="!update_inspection_successful">
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label for="inspection_location">Location</label>
                <select class="form-control" id="inspection_location" v-model="location_selected">
                  <option>Kuala Lumpur</option>
                  <option>Penang</option>
                </select>
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_location"
                >Please select a location.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label for="inspection_branch">Branch</label>
                <select
                  class="form-control"
                  id="inspection_branch"
                  v-model="branch_selected"
                  :disabled="branch_field_disabled"
                >
                  <option v-for="branch in branches" :key="branch.id">{{ branch.label }}</option>
                </select>
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_branch"
                >Please select a branch.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label>Date</label>
                <vc-date-picker
                  v-model="inspection_date"
                  color="yellow"
                  :min-date="new Date()"
                  :max-date="new Date(new Date().getTime() + (21 * 24 * 60 * 60 * 1000))"
                  :disabled-dates="{ weekdays: [1] }"
                />
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_date"
                >Please enter the inspection date.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label>Time</label>
                <!-- <input type="time" class="form-control" /> -->
                <vue-timepicker
                  format="H:mm"
                  :minute-interval="30"
                  :hour-range="hour_range"
                  hide-disabled-hours
                  auto-scroll
                  hide-clear-button
                  lazy
                  input-width="100%"
                  :disabled="time_field_disabled"
                  v-model="inspection_time"
                ></vue-timepicker>
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_time"
                >Please select a time for your inspection.</small>
                <small :class="availability_msg_class">{{ availability_status_msg }}</small>
              </div>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-12">
              <button
                type="button"
                class="btn btn-lg btn-block btn-warning"
                @click.prevent="reschedule_appointment"
                :disabled="!availability_status"
              >Reschedule</button>
            </div>
          </div>
          <hr class="divider" />
          <div class="row">
            <div class="col-12 text-center">
              <a type="button" class="btn btn-link text-secondary" href="/">Back to main page</a>
            </div>
          </div>
        </div>
        <div v-if="update_inspection_successful">
          <div class="row">
            <div class="col-12">
              <h1 class="text-center mb-1">It's a YES!</h1>
              <p class="text-dark text-center">
                Woo! Your appointment has been
                <span class="text-success">rescheduled</span>!
                You will receive the confirmation email shortly.
              </p>
              <a
                href="#"
                type="button"
                class="btn btn-lg btn-block btn-warning"
                @click.prevent="add_to_calendar"
              >Add appointment to my calendar</a>
            </div>
          </div>
          <hr class="divider" />
          <!-- <p class="text-center">Or</p> -->
          <div class="row">
            <div class="col-12 text-center text-dark">
              <a href="/">Back to home page</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8 col-lg-8 col-xl-8 d-none d-lg-block pr-lg-0">
        <div
          class="bg-cover vh-100"
          style="
            background-size: cover; 
            background-repeat: no-repeat; 
            background-position: center; 
            background-image:url(https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80);"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.1;
}
.divider {
  background-color: #dee2e6;
  height: 1px;
  width: 50%;
}
</style>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import VueTimepicker from "vue2-timepicker";
import InspectionService from "../InspectionService";
import InspectionCard from "../components/InspectionCard";
import InspectionCardEmptyState from "../components/InspectionCardEmptyState";

export default {
  name: "RescheduleAppointment",
  components: {
    VuePhoneNumberInput,
    VueTimepicker,
    InspectionCard,
    InspectionCardEmptyState
  },
  data() {
    return {
      branches: null,
      branch_field_disabled: true,
      location_selected: "",
      branch_selected: "",
      inspection_date: "",
      inspection_time: "9:00",
      hour_range: [9, 10, 11, 12, 13, 14, 15, 16, 17],
      inspections: [],
      availability_status: false,
      availability_status_msg: "",
      availability_msg_class: "",
      is_invalid_location: false,
      is_invalid_branch: false,
      is_invalid_date: false,
      is_invalid_time: false,
      show_next_page: false,
      update_inspection_successful: false,
      time_field_disabled: false
    };
  },
  async created() {
    try {
      this.inspections = await InspectionService.getInspectionsByID(
        this.$route.params.id
      );
      this.location_selected = this.inspections[0].inspection_location;
      this.branch_selected = this.inspections[0].inspection_branch;
      this.inspection_date = new Date(this.inspections[0].inspection_date);
      this.inspection_time = this.inspections[0].inspection_time;
    } catch (err) {
      console.log(err.message);
    }
  },
  watch: {
    location_selected: function(val) {
      if (val === "Kuala Lumpur") {
        this.branches = [
          { id: 1, label: "Ampang" },
          { id: 2, label: "Puchong" },
          { id: 3, label: "Kelana Jaya" }
        ];
        this.branch_field_disabled = false;
      }
      if (val === "Penang") {
        this.branches = [{ id: 4, label: "Perai" }];
        this.branch_field_disabled = false;
      }
      this.check_schedule();
    },
    branch_selected: function(val) {
      if (val !== "") {
        this.date_field_disabled = false;
        this.check_schedule();
      }
    },
    inspection_date: function(val) {
      if (val !== "") {
        this.time_field_disabled = false;
      }
      this.update_hour_range(val);
      this.check_schedule();
    },
    inspection_time: function(val) {
      this.check_schedule();
    }
  },
  methods: {
    validate_field: function(field) {
      if (field === "location") {
        if (
          this.location_selected === "" ||
          this.location_selected === undefined
        ) {
          this.is_invalid_location = true;
          return false;
        } else {
          this.is_invalid_location = false;
          return true;
        }
      }
      if (field === "branch") {
        if (this.branch_selected === "") {
          this.is_invalid_branch = true;
          return false;
        } else {
          this.is_invalid_branch = false;
          return true;
        }
      }
      if (field === "date") {
        if (this.inspection_date === "") {
          this.is_invalid_date = true;
          return false;
        } else {
          this.is_invalid_date = false;
          return true;
        }
      }
      if (field === "time") {
        if (this.inspection_time === "") {
          this.is_invalid_time = true;
          return false;
        } else {
          this.is_invalid_time = false;
          return true;
        }
      }
    },
    add_to_calendar: function() {
      let start = new Date(
        this.inspection_date.getFullYear(),
        this.inspection_date.getMonth(),
        this.inspection_date.getDate(),
        parseInt(this.inspection_time.split(":")[0]),
        parseInt(this.inspection_time.split(":")[1]),
        0,
        0
      );
      let end = new Date(
        this.inspection_date.getFullYear(),
        this.inspection_date.getMonth(),
        this.inspection_date.getDate(),
        parseInt(this.inspection_time.split(":")[0]),
        parseInt(this.inspection_time.split(":")[1]) + 30,
        0,
        0
      );
      this.$ics.addEvent(
        "en-us",
        "Carsome Inspection Appointment",
        "Carsome Inspection Appointment",
        this.location_selected + " - " + this.branch_selected,
        start,
        end,
        "https://carsome.my"
      );
      this.$ics.download("Carsome Inspection Appointment");
    },
    update_hour_range: function(date_val) {
      let today_date = new Date().toDateString(); // get today's date
      if (date_val.toDateString() === today_date) {
        let current_hour = new Date().getHours();
        let disabled_hours = [];

        // disable current hour & hours before current hour if inspection date is today's date
        for (let i = 9; i < current_hour + 1; i++) {
          disabled_hours.push(i);
        }
        this.hour_range = this.hour_range.filter(
          value => !disabled_hours.includes(value)
        );
        if (this.inspection_time === "") {
          this.inspection_time = this.hour_range[0].toString() + ":00";
        }

        // disable time picker if it's today's date and after office hour
        if(current_hour > 17){
          this.time_field_disabled = true;
        }
        // this.inspection_time = this.hour_range[0].toString() + ":00";
      } else {
        this.hour_range = [9, 10, 11, 12, 13, 14, 15, 16, 17];
        if (this.inspection_time === "") {
          this.inspection_time = "9:00";
        }
        // this.inspection_time = "9:00";
      }
    },
    reschedule_appointment() {
      let is_location_field_valid = this.validate_field("location");
      let is_branch_field_valid = this.validate_field("branch");
      let is_date_field_valid = this.validate_field("date");
      let is_time_field_valid = this.validate_field("time");
      if (
        is_location_field_valid === true &&
        is_branch_field_valid === true &&
        is_date_field_valid === true &&
        is_time_field_valid === true &&
        this.availability_status === true
      ) {
        this.update_inspection();
      }
    },
    async update_inspection() {
      let body = {
        inspection_location: this.location_selected,
        inspection_branch: this.branch_selected,
        inspection_date: this.inspection_date.toLocaleDateString(),
        inspection_time: this.inspection_time,
        updatedAt: new Date()
      };
      await InspectionService.updateInspection(
        this.$route.params.id,
        body
      ).then(
        response => {
          this.show_next_page = false;
          this.update_inspection_successful = true;
          console.log("update successful");
        },
        error => {
          console.log(error);
        }
      );
    },
    async check_schedule() {
      let inspection_date_day = 0;
      let max_inspection_slots = 2;
      let params = "";

      // if inspection date is sat, change max inspection slots to 4
      if (inspection_date_day === 6) {
        max_inspection_slots = 4;
      }

      // update params
      if (this.branch_selected !== "" && this.branch_selected !== undefined) {
        params += "&inspection_branch=" + this.branch_selected;
      }
      if (this.inspection_date !== "") {
        inspection_date_day = this.inspection_date.getDay();
        params +=
          "&inspection_date=" + this.inspection_date.toLocaleDateString();
      }
      if (this.inspection_time !== "") {
        params += "&inspection_time=" + this.inspection_time;
      }

      if (
        this.branch_selected !== "" &&
        this.inspection_date !== "" &&
        this.inspection_time !== ""
      ) {
        try {
          let inspections = await InspectionService.getInspections(params);
          if (inspections.length >= max_inspection_slots) {
            this.availability_msg_class = "form-text text-danger";
            this.availability_status_msg =
              "This slot is currently full. Please choose another time/date.";
            this.availability_status = false;
          } else {
            this.availability_msg_class = "form-text text-success";
            this.availability_status_msg = "This slot is available. :) ";
            this.availability_status = true;
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    }
  }
};
</script>