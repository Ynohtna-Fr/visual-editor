<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte'
  import Flex from '$lib/components/ui/Flex.svelte'
  import { t } from '$lib/functions/i18n'
</script>

<div class="sidebar-footer">
  <Flex between>
    <div class="mention">
      {t('poweredBy')}
      <br />
      <a href="https://boxraiser.com" target="_blank" rel="noopener noreferrer">
        <img
          src="https://static.boxraiser.com/logo.svg"
          alt="Logo Boxraiser"
          class="logo"
        />
      </a>
    </div>
    <Button type="submit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        style="margin-right: 0.5em;"
      >
        <path
          d="M7 19v-6h10v6h2V7.828L16.172 5H5v14h2zM4 3h13l4 4v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm5 12v4h6v-4H9z"
          fill="currentColor"
        />
      </svg>
      {t('save')}
    </Button>
  </Flex>
</div>

<style>
  .sidebar-footer {
    margin-top: auto;
    background-color: #fff;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding: 0.5em 1em;
    box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .mention {
    font-size: 0.7em;
    margin-right: auto;
  }

  .logo {
    width: auto;
    height: 20px;
  }
</style>
