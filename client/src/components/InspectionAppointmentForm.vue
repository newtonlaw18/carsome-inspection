<template>
  <!-- Container -->
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-md-4 col-lg-4 col-xl-4 px-lg-5">
        <h1 class="text-center mb-1" v-if="!create_inspection_successful">Welcome to Carsome!</h1>
        <p
          class="text-muted text-center"
          v-if="!create_inspection_successful"
        >Please fill in the form below to begin.</p>
        <div v-if="!show_next_page&&!create_inspection_successful">
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label for="inspection_carbrand">Brand</label>
                <select class="form-control" id="inspection_carbrand" v-model="car_brand_selected">
                  <option>Perodua</option>
                  <option>Honda</option>
                </select>
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_car_brand"
                >Please select a car brand.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label for="inspection_carmodel">Model</label>
                <select
                  class="form-control"
                  id="inspection_carmodel"
                  v-model="car_model_selected"
                  :disabled="car_model_field_disabled"
                >
                  <option v-for="carmodel in carmodels" :key="carmodel.id">{{ carmodel.label }}</option>
                </select>
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_car_model"
                >Please select a car model.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label for="inspection_name">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="inspection_name"
                  v-model="customer_name"
                />
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_name"
                >Please enter a valid name.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label for="inspection_email">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="inspection_email"
                  v-model="customer_email"
                />
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_email"
                >Please enter a valid email address.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group text-left">
                <label>Phone Number</label>
                <VuePhoneNumberInput
                  v-model="phone_number"
                  :default-country-code="'MY'"
                  @update="phone_filtered = $event"
                />
                <small
                  class="form-text text-danger"
                  v-if="is_invalid_phone_number"
                >Please enter a valid phone number.</small>
              </div>
            </div>
          </div>
          <div class="row mt-1">
            <div class="col-12">
              <button
                type="button"
                class="btn btn-lg btn-block btn-warning"
                @click.prevent="next_page"
              >Next</button>
            </div>
          </div>
          <hr class="divider" />
          <!-- <p class="text-center">Or</p> -->
          <div class="row">
            <div class="col-12 text-center">
              <p>
                I'd like to
                <router-link to="/findappointment" class="text-danger"><b>reschedule or cancel</b></router-link> my appointment.
              </p>
            </div>
          </div>
        </div>
        <div v-if="show_next_page&&!create_inspection_successful">
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
                @click.prevent="make_appointment"
                :disabled="!availability_status"
              >Make Appoinment</button>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12 text-center">
              <button
                type="button"
                class="btn btn-link text-secondary"
                @click.prevent="previous_page"
              >Back</button>
            </div>
          </div>
        </div>
        <div v-if="create_inspection_successful">
          <div class="row">
            <div class="col-12">
              <h1 class="text-center mb-1">It's a YES!</h1>
              <p class="text-dark text-center">
                Woo! Your appointment is
                <span class="text-success">confirmed</span>!
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

export default {
  name: "InspectionAppointmentForm",
  components: {
    VuePhoneNumberInput,
    VueTimepicker
  },
  data() {
    return {
      is_invalid_name: false,
      is_invalid_email: false,
      is_invalid_car_brand: false,
      is_invalid_car_model: false,
      is_invalid_phone_number: false,
      is_invalid_location: false,
      is_invalid_branch: false,
      is_invalid_date: false,
      is_invalid_time: false,
      car_model_field_disabled: true,
      branch_field_disabled: true,
      date_field_disabled: true,
      time_field_disabled: true,
      show_next_page: false,
      create_inspection_successful: false,
      customer_name: "",
      customer_email: "",
      car_brand_selected: "",
      car_model_selected: "",
      carmodels: null,
      branches: null,
      country_code: "",
      phone_number: "",
      phone_filtered: null,
      location_selected: "",
      branch_selected: "",
      inspection_date: "",
      inspection_time: "9:00",
      hour_range: [9, 10, 11, 12, 13, 14, 15, 16, 17],
      inspections: [],
      availability_status: false,
      availability_status_msg: "",
      availability_msg_class: ""
    };
  },
  watch: {
    car_brand_selected: function(val) {
      if (val === "Perodua") {
        this.carmodels = [
          { id: 1, label: "Aruz" },
          { id: 2, label: "Myvi" },
          { id: 3, label: "Axia" }
        ];
        this.car_model_field_disabled = false;
      }
      if (val === "Honda") {
        this.carmodels = [
          { id: 4, label: "CRV" },
          { id: 5, label: "BRV" },
          { id: 6, label: "City" },
          { id: 7, label: "Jazz" }
        ];
        this.car_model_field_disabled = false;
      }
    },
    location_selected: function(val) {
      this.branch_selected = "";
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
        // disable time picker if it's today's date and after office hour
        if(current_hour > 17){
          this.time_field_disabled = true;
        }
        this.inspection_time = this.hour_range[0].toString() + ":00";
      } else {
        this.hour_range = [9, 10, 11, 12, 13, 14, 15, 16, 17];
        this.inspection_time = "9:00";
      }
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
    },
    validate_field: function(field) {
      if (field === "name") {
        let re = /^[A-Za-z ]+$/; // regex to check name contains only characters
        if (!re.test(this.customer_name)) {
          this.is_invalid_name = true;
          return false;
        } else {
          this.is_invalid_name = false;
          return true;
        }
      }
      if (field === "email") {
        let re = /\S+@\S+\.\S+/; //regex to validate email
        if (!re.test(this.customer_email)) {
          this.is_invalid_email = true;
          return false;
        } else {
          this.is_invalid_email = false;
          return true;
        }
      }
      if (field === "car_brand") {
        if (this.car_brand_selected === "") {
          this.is_invalid_car_brand = true;
          return false;
        } else {
          this.is_invalid_car_brand = false;
          return true;
        }
      }
      if (field === "car_model") {
        if (this.car_model_selected === "") {
          this.is_invalid_car_model = true;
          return false;
        } else {
          this.is_invalid_car_model = false;
          return true;
        }
      }
      if (field === "phone_number") {
        if (this.phone_number === "") {
          this.is_invalid_phone_number = true;
          return false;
        } else {
          this.is_invalid_phone_number = false;
          return true;
        }
      }
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
    next_page: function() {
      let is_name_field_valid = this.validate_field("name");
      let is_email_field_valid = this.validate_field("email");
      let is_car_brand_field_valid = this.validate_field("car_brand");
      let is_car_model_field_valid = this.validate_field("car_model");
      let is_phone_number_field_valid = this.validate_field("phone_number");
      if (
        is_name_field_valid === true &&
        is_email_field_valid === true &&
        is_car_brand_field_valid === true &&
        is_car_model_field_valid === true &&
        is_phone_number_field_valid === true
      ) {
        this.show_next_page = true;
      }
    },
    previous_page: function() {
      this.show_next_page = false;
    },
    make_appointment: function() {
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
        this.create_inspection();
      }
    },
    async create_inspection() {
      let body = {
        brand: this.car_brand_selected,
        model: this.car_model_selected,
        customer_name: this.customer_name,
        customer_email: this.customer_email,
        phone_number: this.phone_filtered.formatInternational,
        phone_country_code: this.phone_filtered.countryCode,
        inspection_location: this.location_selected,
        inspection_branch: this.branch_selected,
        inspection_date: this.inspection_date.toLocaleDateString(),
        inspection_time: this.inspection_time
      };
      await InspectionService.insertInspection(body).then(
        response => {
          this.show_next_page = false;
          this.create_inspection_successful = true;
        },
        error => {
          console.log(error);
        }
      );
    }
  }
};
</script>
