<template>
  <div class="card mt-3">
    <div class="card-body">
      <p
        class="card-text m-0 font-weight-bold"
      >{{ inspection.inspection_location + ' - ' + inspection.inspection_branch }}</p>
      <p class="card-text m-0 text-info font-weight-bold">{{ inspection.customer_name }}</p>
      <p class="card-text m-0">
        <span class="font-weight-bold">Model:</span>
        {{ inspection.brand + ' - ' + inspection.model}}
      </p>
      <p class="card-text m-0">
        <span class="font-weight-bold">Date:</span>
        {{ inspection.inspection_date + ' - ' + inspection.inspection_time }}
      </p>
      <!-- <a
        href="#"
        class="btn btn-link text-warning pl-0 font-weight-bold"
        @click.prevent="reschedule_appointment(inspection._id)"
      >Reschedule</a> -->
      <router-link class="btn btn-link text-warning pl-0 font-weight-bold" :to="{name: 'RescheduleAppointment', params: {id: inspection._id}}">Reschedule</router-link>
      <a
        href="#"
        class="btn btn-link text-danger pl-0 font-weight-bold"
        @click.prevent="delete_appointment(inspection._id)"
        data-toggle="modal"
        data-target="#exampleModal"
      >Delete</a>
    </div>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Notification</h5>
            <a href="#" type="button" class="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </a>
          </div>
          <div class="modal-body">{{ notification_msg }}</div>
          <div class="modal-footer">
            <a href="/" type="button" class="btn btn-secondary">Back to main page</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InspectionService from "../InspectionService";

export default {
  name: "InspectionCard",
  props: ["inspection"],
  data() {
    return {
      notification_msg: ""
    };
  },
  methods: {
    async delete_appointment(id) {
      console.log(id);
      try {
        await InspectionService.deleteInspection(id).then(
          response => {
            console.log(response);
            this.notification_msg =
              "Your appointment has been cancelled successfully. We hope to see you again.";
          },
          error => {
            console.log(error);
            this.notification_msg = "Unable to remove your appointment.";
          }
        );
      } catch (err) {
        console.log(err.message);
      }
    },
    reschedule_appointment(id) {
      console.log(id);
    }
  }
};
</script>