<?= $this->hook->render('template:dashboard:show:before-filter-box', array('user' => $user)) ?>

<div class="filter-box margin-bottom">
  <form method="get" action="<?= $this->url->dir() ?>" class="search">
    <?= $this->form->hidden('controller', array('controller' => 'SearchController')) ?>
    <?= $this->form->hidden('action', array('action' => 'index')) ?>

    <div class="input-addon">
      <?= $this->form->text('search', array(), array(), array('placeholder="'.t('Search').'"', 'aria-label="'.t('Search').'"'), 'input-addon-field') ?>
      <div class="input-addon-item">
        <?= $this->render('app/filters_helper') ?>
      </div>
    </div>
  </form>
</div>

<?= $this->hook->render('template:dashboard:show:after-filter-box', array('user' => $user)) ?>

<?php if (! $project_paginator->isEmpty()): ?>
<div class="table-list">
  <?= $this->render('project_list/header', array('paginator' => $project_paginator)) ?>
  <?php foreach ($project_paginator->getCollection() as $project): ?>
  <div class="table-list-row table-border-left">
    <div>
      <?php if ($this->user->hasProjectAccess('ProjectViewController', 'show', $project['id'])): ?>
      <?= $this->render('project/dropdown', array('project' => $project)) ?>
      <?php else: ?>
      <strong><?= '#'.$project['id'] ?></strong>
      <?php endif ?>

      <?= $this->hook->render('template:dashboard:project:before-title', array('project' => $project)) ?>

      <span class="table-list-title <?= $project['is_active'] == 0 ? 'status-closed' : '' ?>">
        <?= $this->url->link($this->text->e($project['name']), 'BoardViewController', 'show', array('project_id' => $project['id'])) ?>
      </span>

      <?php if ($project['is_private']): ?>
      <i class="fa fa-lock fa-fw" title="<?= t('Personal project') ?>" role="img"
        aria-label="<?= t('Personal project') ?>"></i>
      <?php endif ?>

      <?= $this->hook->render('template:dashboard:project:after-title', array('project' => $project)) ?>

    </div>
    <div class="table-list-details">
      <?php foreach ($project['columns'] as $column): ?>
      <strong title="<?= t('Task count') ?>"><span class="ui-helper-hidden-accessible"><?= t('Task count') ?>
        </span><?= $column['nb_open_tasks'] ?></strong>
      <small><?= $this->text->e($column['title']) ?></small>
      <?php endforeach ?>
    </div>
  </div>
  <?php endforeach ?>
</div>

<?= $project_paginator ?>
<?php endif ?>

<?php if (empty($overview_paginator)): ?>
<p class="alert"><?= t('There is nothing assigned to you.') ?></p>
<?php else: ?>

<?php foreach ($overview_paginator as $result): ?>

<?php if (! $result['paginator']->isEmpty()): ?>
<div class="page-header">
  <h2 id="project-tasks-<?= $result['project_id'] ?>">
    <?= $this->url->link($this->text->e($result['project_name']), 'BoardViewController', 'show', array('project_id' => $result['project_id'])) ?>
  </h2>
</div>

<div class="table-list">
  <?= $this->render('task_list/header', array(
                    'paginator' => $result['paginator'],
                )) ?>

  <?php foreach ($result['paginator']->getCollection() as $task): ?>
  <div class="table-list-row color-<?= $task['color_id'] ?>">
    <?= $this->render('task_list/task_title', array(
                            'task' => $task,
                            'redirect' => 'dashboard',
                        )) ?>

    <?= $this->render('task_list/task_details', array(
                            'task' => $task,
                        )) ?>

    <?= $this->render('task_list/task_avatars', array(
                            'task' => $task,
                        )) ?>

    <?= $this->render('task_list/task_icons', array(
                            'task' => $task,
                        )) ?>

    <?= $this->render('task_list/task_subtasks', array(
                            'task'    => $task,
                            'user_id' => $user['id'],
                        )) ?>

    <?= $this->hook->render('template:dashboard:task:footer', array('task' => $task)) ?>
  </div>
  <?php endforeach ?>
</div>

<?= $result['paginator'] ?>
<?php endif ?>
<?php endforeach ?>
<?php endif ?>
<?= $this->hook->render('template:dashboard:show', array('user' => $user)) ?>

<div class="timetable">
  <div class="selects">
    <select name="month-select" id="month-select" class="table-select" multiple>
      <option value="00">Select month</option>
      <option value="01">January</option>
      <option value="02">February</option>
      <option value="03">March</option>
      <option value="04">April</option>
      <option value="05">May</option>
      <option value="06">June</option>
      <option value="07">July</option>
      <option value="08">August</option>
      <option value="09">September</option>
      <option value="10">October</option>
      <option value="11">Novemeber</option>
      <option value="12">December</option>
    </select>
    <select name="year-select" id="year-select" class="short-select table-select">
      <option value="0000">Select year</option>
      <?php
          $yearsShow = 5;
          $currentYear = date("Y");
          
          for ($i = 0; $i <= $yearsShow; $i++) {
            echo "<option value='{$currentYear}'>{$currentYear}</option>";  
            $currentYear--;
          }    
        ?>
    </select>

  </div>


  <table id="task-timetable">
    <tr>
      <th>Project</th>
      <th>Task</th>
      <th>Time estimated</th>
      <th>Time spent</th>
      <th>Task started</th>
    </tr>

    <?php foreach ($overview_paginator as $result): ?>

    <?php foreach ($result['paginator']->getCollection() as $task): ?>
    <?php 
          $dt = $task['date_started'] != 0 // If starting date isn't determined, the ceration date will be used 
          ? new DateTime("@" . $task['date_started'])
          : new DateTime("@" . $task['date_creation']);
          $summary += $task['time_spent'];
        ?>

    <?php if(empty($task['subtasks']))  { 
          echo "<tr>
              <td>
                <a href=/?controller=BoardViewController&action=show&project_id=" . $task['project_id'] . ">" . $task['project_name'] . "</a>
              </td>
              <td>
                    <a href=/?controller=TaskViewController&action=show&task_id=" . $task['id'] . ">" . $task['title'] . "</a>
              </td>
              <td>
                " . $task['time_estimated'] . " hours
              </td>
              <td>
                " . $task['time_spent'] . " hours
              </td>
              <td>
                " . $dt->format('d-m-Y H:i:s') . "
              </td>

            </tr>";
        ?>
    <?php }else { ?>
    <?php
              foreach ($task['subtasks'] as $subtask) {
                if($subtask['username'] == $user['username']) { ?>
    <tr>
      <td>
        <a
          href=<?= "/?controller=BoardViewController&action=show&project_id=" . $task['project_id'] ?>><?= $task['project_name'] ?></a>
      </td>
      <td>
        <?php
                            echo '<a href="/?controller=TaskViewController&action=show&task_id=' . $task['id'] . '">' . $subtask['title'] . '</a>';
                        ?>
      </td>
      <td>
        <?= $subtask['time_estimated'] ?> hours
      </td>
      <td>
        <?= $subtask['time_spent'] ?> hours
      </td>
      <td>
        <?= $dt->format('d-m-Y H:i:s'); ?>
      </td>
    </tr>
    <?php } } ?>
    <?php } ?>
    <?php endforeach ?>
    <?php endforeach ?>
    <tr>
      <td class="empty-cell"></td>
      <td class="empty-cell"></td>
      <td class="empty-cell"></td>
      <td class="main-cell">Sum: <span id="sum-hours"><?= $summary ?></span> hours</td>
    </tr>
  </table>

  <h2 class="revealed-info hidden">There are no task to show. Choose another date.</h2>
  <a id="csv-download">Download as CSV</a>

</div>