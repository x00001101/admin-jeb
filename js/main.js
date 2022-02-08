console.log(window.location.pathname);

// global variable
const url = "https://sandbag.jeb-deploy.com";

const PATHURL = "/C:/Users/Masandy/admin-jeb/";

// Spinner
var spinner = () => {
  setTimeout(() => {
    if ($("#spinner").length > 0) {
      $("#spinner").removeClass("show");
    }
  }, 100);
};

// ajax global setup
$.ajaxSetup({
  beforeSend: () => {
    $("#spinner").toggleClass("show");
  },
  complete: () => {
    spinner();
  },
});

(($) => {
  "use strict";

  const removeActiveLinkClass = () => {
    $(".nav-item.nav-link").each((i, v) => {
      $(v).removeClass("active");
    });
  };

  spinner();

  // check if user not loged in
  let header = localStorage.getItem("header") || Cookies.get("header");
  if (typeof header === "undefined") {
    header = null;
  } else {
    const storage = localStorage.getItem("dataUser") || Cookies.get("dataUser");
    const dataUser = JSON.parse(storage);

    $(".admin_name").each((i, v) => {
      $(v).text(dataUser.name);
    });
  }
  const pathname = window.location.pathname;
  // console.log(pathname);
  if (header === null && pathname != PATHURL + "signin.html") {
    window.location.href = PATHURL + "signin.html";
  }

  // Back to top button
  $(window).scroll(() => {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(() => {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Sidebar Toggler
  $(".sidebar-toggler").click(() => {
    $(".sidebar, .content").toggleClass("open");
    return false;
  });

  // Calender
  $("#calender").datetimepicker({
    inline: true,
    format: "L",
  });

  const getUserData = (accessToken) => {
    const data = $.ajax({
      url: `${url}/usersData`,
      type: "GET",
      async: false,
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      },
      success: (res) => {
        return res;
      },
    });
    return data;
  };

  const signin = () => {
    let remember = false;
    if ($("#exampleCheck1").is(":checked")) {
      remember = true;
    }
    $.ajax({
      url: `${url}/auth`,
      type: "POST",
      dataType: "JSON",
      data: {
        email: $("#floatingInput").val(),
        password: $("#floatingPassword").val(),
      },
      success: async (res) => {
        // find that user is admin
        const dataUser = await getUserData(res.accessToken);
        if (Number(dataUser.permissionLevel) < 2048) {
          alert("You are not an admin!");
        } else {
          // set header
          localStorage.setItem("header", res.accessToken);
          localStorage.setItem("dataUser", JSON.stringify(dataUser));
          if (remember) {
            console.log("checked");
            Cookies.set("header", res.accessToken);
            Cookies.set("dataUser", JSON.stringify(dataUser));
          }
          // get to index.html
          window.location.href = PATHURL + "index.html";
        }
      },
      statusCode: {
        404: (err) => {
          alert(err.responseJSON.message);
        },
        400: (err) => {
          alert(err.responseJSON.errors[0]);
        },
      },
    });
  };

  $("#signin").click(() => {
    signin();
  });

  const signout = () => {
    localStorage.removeItem("header");
    localStorage.removeItem("dataUser");
    Cookies.remove("header");
    Cookies.remove("dataUser");
    spinner();
    window.location.href = PATHURL + "signin.html";
  };

  $("#logout").click(() => {
    signout();
  });

  const getPage = (pageName) => {
    $.ajax({
      url: `_${pageName}.html`,
      success: (res) => {
        $("#page-container").html(res);
        removeActiveLinkClass();
        $(`#${pageName}`).toggleClass("active");
      },
    });
  };

  // change page and set active links to navbar
  $(".nav-item.nav-link").each((i, v) => {
    $(v).click(function () {
      const id = $(this).attr("id");
      getPage(id);
    });
  });
})(jQuery);
