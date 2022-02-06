<template>
  <div class="side-menu">
    <div class="menu-logo">
      <v-img
        :src="require('~/static/boniad-ehsan-logo.png')"
        class="mx-auto mt-5"
        max-width="90%"
        width="90px"
      />
    </div>
    <div class="menu-items">
      <ul class="menu-items-list">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          class="menu-item "
        >
          <div
            v-if="$route.path === '/abrisham/' + item.routeName"
            class="menu-indicator"
          />
          <router-link
            :to="{path: item.path} "
          >
            <i
              class="fi"
              :class="['fi-rr-' + item.icon , $route.path === '/abrisham/' + item.routeName ? 'activate' :'']"
            />
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  data() {
    return {
      isActive: null,
      menuItems: [
        // {
        //     icon: 'home',
        //     path: '/abrisham/home',
        // },
        {
          icon: 'play-alt',
          path: '/abrisham/UserAbrishamProgress',
        },
        // {
        //     icon: 'calendar',
        //     path: '/abrisham/Schedule',
        // },
        // {
        //     icon: 'headphones',
        //     path: '/abrisham/consulting',
        // },
        // {
        //     icon: 'list-check',
        //     path: '/abrisham/my-performance',

        // },
        // {
        //     icon: 'stats',
        //     path: '/abrisham/assessment',
        // },
        // {
        //     icon: 'envelope',
        //     path: '/abrisham/news',
        // },
        {
          icon: 'world',
          path: '/abrisham/map',
        },
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters['Auth/user']
    }
  },
  created() {
    if (this.user.hasPermission('accessBonyadEhsanAdminPanel')) {
      this.menuItems.push({
        icon: 'settings',
        path: '/admin/user/create'
      })
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.side-menu {
  min-height: calc(100vh - 2px);
  display: flex !important;
  flex-direction: column;

  .menu-logo {
    text-align: center;
    margin: 30px auto 130px;
    height: 60px;
    @media screen and (max-width: 1904px) {
      margin: 20px auto 76px;
    }
    @media screen and (max-width: 1200px) {
      margin: 20px auto 66px;
    }
    @media screen and (max-width: 960px) {
      margin: 10px auto 266px !important;
    }

    .logo-image {
      width: 60px;
      height: 60px;
      @media screen and (max-width: 1200px) {
        width: 50px;
        height: 50px;
      }
      @media screen and (max-width: 960px) {
        width: 40px;
        height: 40px;
      }
    }

    @media screen and (max-width: 1200px) {
      height: 50px;
    }
    @media screen and (max-width: 960px) {
      height: 40px;
    }
  }

  .menu-items {
    position: relative;

    .menu-items-list {
      position: relative;
      padding: 0;

      .menu-item {
        list-style: none;
        margin-bottom: 26px;
        text-align: center;

        a {
          text-decoration: none;
        }

        .activate {
          color: #ff8f00 !important;
        }

        .menu-indicator {
          position: absolute;
          height: 36px;
          width: 8px;
          background-color: #ff8f00;
          border: none;
          border-radius: 6px 0 0 6px;
          @media screen and (max-width: 1200px) {
            height: 32px;
            border-radius: 4px 0 0 4px;
          }
          @media screen and (max-width: 960px) {
            height: 28px;
            width: 6px;
          }
        }

        .fi {
          color: #b1ccee;
          font-size: 26px;
          position: relative;
          top: 5px;
          @media screen and (max-width: 1200px) {
            font-size: 20px;
          }
          @media screen and (max-width: 960px) {
            font-size: 19px;
          }
        }

        @media screen and (max-width: 1200px) {
          margin-bottom: 16px !important;
          vertical-align: middle;
        }
        @media screen and (max-width: 960px) {
          margin-bottom: 12px !important;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
}
</style>
