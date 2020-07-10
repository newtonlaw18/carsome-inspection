<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col-12 col-md-4 col-lg-4 col-xl-4 px-lg-5">
        <h1 class="text-center mb-1">Welcome to Carsome!</h1>
        <p
          class="text-muted text-center"
        >Please begin by enter the email you made the appointment with.</p>
        <div v-if="!show_next_page">
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
          <div class="row mt-1">
            <div class="col-12">
              <button
                type="button"
                class="btn btn-lg btn-block btn-warning"
                @click.prevent="find_appointment"
              >Find My Appointment</button>
            </div>
          </div>
          <hr class="divider" />
          <!-- <p class="text-center">Or</p> -->
          <div class="row">
            <div class="col-12 text-center">
              <p>
                I'd like to
                <router-link to="/" class="text-info">
                  <b>create</b>
                </router-link> an appointment instead.
              </p>
            </div>
          </div>
        </div>
        <div v-if="show_next_page">
          <div class="row">
            <div class="col-12">
              <div class="text-center spinner-border text-warning" role="status" v-if="loading">
                <span class="sr-only">Loading...</span>
              </div>
              <InspectionCard
                v-for="inspection in inspections"
                :key="inspection._id"
                :inspection="inspection"
              />
              <InspectionCardEmptyState v-if="show_empty_state" />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12 text-center">
              <a
                type="button"
                class="btn btn-link text-secondary"
                href="/findappointment"
              >Back</a>
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
  name: "DeleteAppointment",
  components: {
    VuePhoneNumberInput,
    VueTimepicker,
    InspectionCard,
    InspectionCardEmptyState
  },
  data() {
    return {
      is_invalid_email: false,
      customer_email: "",
      show_next_page: false,
      inspections: [],
      show_empty_state: false,
      loading: false
    };
  },
  methods: {
    validate_field: function(field) {
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
    },
    previous_page: function() {
      this.show_next_page = false;
    },
    async find_appointment() {
      let is_email_field_valid = this.validate_field("email");
      if (is_email_field_valid === true) {
        this.show_next_page = true;
        this.loading = true;
        this.show_empty_state = false;
        try {
          this.inspections = await InspectionService.getInspections(
            "customer_email=" + this.customer_email
          );
          this.loading = false;
          if (this.inspections.length === 0) {
            this.show_empty_state = true;
          } else {
            this.show_empty_state = false;
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    }
  }
};
</script>