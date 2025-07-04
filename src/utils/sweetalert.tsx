import Swal from 'sweetalert2';

export function msgSuccess(props: {
  title: string;
  text: string;
  btnOKText: string;
  btnOKColor: string;
}) {
  return Swal.fire({
    icon: 'success',
    title: props.title,
    text: props.text,
    showConfirmButton: true,
    confirmButtonText: props.btnOKText,
    confirmButtonColor: props.btnOKColor,
    customClass: {
      popup: 'swal-small-popup',
    },
  });
}

export function msgError(props: {
  title: string;
  text: string;
  btnOKText: string;
  btnOKColor: string;
}) {
  return Swal.fire({
    icon: 'error',
    title: props.title,
    text: props.text,
    showConfirmButton: true,
    confirmButtonText: props.btnOKText,
    confirmButtonColor: props.btnOKColor,
    customClass: {
      popup: 'swal-small-popup',
      icon: 'swal-swal-icon-error',
    },
  });
}
