export const configsCert = (nameCourse, nameStudent) => {
  return `
    <script>
        window.onload = function () {
            document.getElementById('nameCourse').innerText = "${nameCourse}";
            document.getElementById('nameStudent').innerText = "${nameStudent}";
        };
    </script>
  `;
};
