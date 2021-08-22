<template>
  <div>
    <b-table striped hover small  :items="projects" :fields="tableFields" responsive="sm">
      <template #cell(Action)="popup">
        <b-button size="sm" @click="popup.toggleDetails" class="mr-2">Edit</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  props: ["projects"],
  data() {
    return {
      tableFields: [
        {
          key: "id",
          sortable: true,
        },
        {
          key: "projectNumber.number",
          label: "Number",
          sortable: true,
        },
        {
          key: "projectInfo.powerOnan",
          label: "ONAN",
          sortable: true,
        },
        {
          key: "projectInfo.powerOnaf",
          label: "ONAF",
          sortable: true,
        },
        {
          key: "projectInfo.lowVoltage",
          label: "HV",
          sortable: false,
        },
        {
          key: "projectInfo.highVoltage",
          label: "LV",
          sortable: false,
        },
        {
          key: "projectInfo.projectManger.fullName",
          label: "PM",
          sortable: true,
        },
        {
          key: "projectInfo.createDate",
          label: "Create Date",
          sortable: true,
        },
        {
          key: "projectInfo.productType",
          label: "Type",
          sortable: false,
        },
        {
          key: "Action",
          label: "Action",
          sortable: false,
        },
      ],
    };
  },
};
</script>

<style>
</style>