<?php
function renderTable($year, $round) {
  ob_start();
?>
  Jahr: <?= $year ?>
  Runde: <?= $round ?>
  <div class="table-responsive">
    <table class="table results">
      <thead>
        <tr>
          <th></th>
          <th><span>test</span></th>
          <th><span>test</span></th>
          <th><span>test</span></th>
          <th><span>test</span></th>
        </tr>
      </thead>
      <tbody>
      <tr>
        <th>1</th>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <th>1</th>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <th>1</th>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <th>1</th>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <th>1</th>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      </tbody>
    </table>
  </div>

<?php
  return ob_get_clean();
}