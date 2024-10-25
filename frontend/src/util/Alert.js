import Swal from "sweetalert2";
import { DangerRight } from "./toastServices";

export const warning = (confirm) => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    iconHtml: '<i class="ri-alert-line"></i>',
    showCancelButton: true,
    confirmButtonText: confirm,
    customClass: {
      confirmButton: "btn bg-theme bg-second text-light me-3",
      cancelButton: "btn bg-dark text-light",
    },
    buttonsStyling: false,
  });
};
