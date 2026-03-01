(function () {
  if (window.__commentsLoaded) return;
  window.__commentsLoaded = true;

  var SUPABASE_URL = 'https://rxymhbkxboiqvjdvobmm.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_zmAY14aXLIQx7zpTzuaa5w_FyhERJ5f';
  var SERVICE_ROLE_KEY = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4eW1oYmt4Ym9pcXZqZHZvYm1tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM0ODMxNCwiZXhwIjoyMDg3OTI0MzE0fQ.qlw7JlJOk_HeN1QlGUBL4nvM1CKYrCNyiJUX6BQgaMA').trim();
  var POST_ID = window.location.pathname;

  var headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
  };

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
  }

  async function loadComments() {
    var container = document.getElementById('comments-list');
    if (!container) return;
    container.innerHTML = '<p style="color:#9a9a9a;font-size:14px;">불러오는 중...</p>';

    var res = await fetch(
      SUPABASE_URL + '/rest/v1/comments?post_id=eq.' + encodeURIComponent(POST_ID) + '&is_approved=eq.true&order=created_at.asc',
      { headers: headers }
    );
    var comments = await res.json();

    if (!comments.length) {
      container.innerHTML = '<p style="color:#9a9a9a;font-size:14px;">아직 댓글이 없습니다. 첫 번째 의견을 남겨보세요.</p>';
      return;
    }

    container.innerHTML = comments.map(function(c) {
      return '<div style="padding:20px 0;border-bottom:1px solid #e8e6e3;">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
        '<strong style="font-size:14px;color:#1a1a1a;">' + escapeHtml(c.author_name) + '</strong>' +
        '<time style="font-size:12px;color:#9a9a9a;">' + formatDate(c.created_at) + '</time>' +
        '</div>' +
        '<p style="font-size:16px;line-height:1.8;color:#1a1a1a;margin:0;">' + escapeHtml(c.content) + '</p>' +
        '</div>';
    }).join('');
  }

  async function submitComment(e) {
    e.preventDefault();
    var name = document.getElementById('comment-name').value.trim();
    var content = document.getElementById('comment-content').value.trim();
    var btn = document.getElementById('comment-submit');
    var msg = document.getElementById('comment-message');

    if (!name || !content) return;

    btn.disabled = true;
    btn.textContent = '제출 중...';

    var res = await fetch(SUPABASE_URL + '/rest/v1/comments', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ post_id: POST_ID, author_name: name, content: content })
    });

    msg.style.display = 'block';
    if (res.status === 201) {
      document.getElementById('comment-name').value = '';
      document.getElementById('comment-content').value = '';
      msg.textContent = '댓글이 제출되었습니다. 검토 후 게시됩니다.';
      msg.style.color = '#c8b99a';
    } else {
      msg.textContent = '오류가 발생했습니다. 다시 시도해주세요.';
      msg.style.color = '#e05c5c';
    }

    btn.disabled = false;
    btn.textContent = '의견 남기기';
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadComments();
    var form = document.getElementById('comment-form');
    if (form) form.addEventListener('submit', submitComment);
  });

})();
